'use strict';

/**
 * Formulaire de contact de viniz.app.
 *
 * GET  /api/contact  -> delivre un jeton horodate et signe (mesure du temps de saisie)
 * POST /api/contact  -> valide, notifie support@viniz.app, accuse reception, alerte Slack
 *
 * Aucune dependance : fetch global (Node 18+) et crypto natif. Le site reste
 * un site statique sans etape de build.
 */

const crypto = require('crypto');

const RESEND_ENDPOINT = 'https://api.resend.com/emails';
const EXPEDITEUR = 'Viniz <contact@viniz.app>';
const REPLI_EMAIL = 'support@viniz.app';
const DELAI_REPONSE = '24 h ouvrées';

// Anti-spam
const DUREE_MIN_SAISIE_MS = 3000;           // en dessous, ce n'est pas un humain
const AGE_MAX_JETON_MS = 2 * 60 * 60 * 1000; // un jeton perime au bout de 2 h
const IP_MAX_ENVOIS = 5;
const IP_FENETRE_MS = 60 * 60 * 1000;

// Bornes de longueur. Un message de 50 000 caracteres est une attaque, pas un prospect.
const CHAMPS = {
  nom:      { requis: true,  min: 1, max: 100,  libelle: 'Nom' },
  activite: { requis: true,  min: 1, max: 120,  libelle: 'Activité' },
  email:    { requis: true,  min: 5, max: 160,  libelle: 'Email' },
  tel:      { requis: false, min: 0, max: 40,   libelle: 'Téléphone' },
  message:  { requis: true,  min: 1, max: 4000, libelle: 'Message' },
};

const EMAIL_PLAUSIBLE = /^[^\s@,;<>]+@[^\s@,;<>]+\.[a-z]{2,}$/i;

/* ------------------------------------------------------------------ */
/* Utilitaires                                                         */
/* ------------------------------------------------------------------ */

/** Echappe tout ce qui vient du visiteur avant de l'inserer dans un HTML d'email. */
function echapper(valeur) {
  return String(valeur == null ? '' : valeur)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

/**
 * Nettoie une valeur destinee a un en-tete d'email (objet).
 * Un en-tete ne doit contenir ni retour a la ligne ni caractere de controle :
 * c'est la porte d'entree classique d'une injection d'en-tetes.
 */
function nettoyerEnTete(valeur) {
  return String(valeur == null ? '' : valeur)
    // eslint-disable-next-line no-control-regex
    .replace(/[\r\n\u0000-\u001F\u007F]+/g, ' ')
    .trim()
    .slice(0, 120);
}

/** Echappe puis restitue les retours a la ligne du message. */
function echapperMultiligne(valeur) {
  return echapper(valeur).replace(/\r?\n/g, '<br>');
}

/**
 * Cle de signature des jetons.
 * FORM_SECRET si Antoine en pose un ; sinon une cle DERIVEE de RESEND_API_KEY.
 * La derivation est a sens unique : la cle ne permet pas de remonter a la cle API,
 * et elle ne quitte jamais le serveur. Une variable dediee reste preferable.
 */
function cleSignature() {
  const base = process.env.FORM_SECRET || process.env.RESEND_API_KEY || '';
  return crypto.createHash('sha256').update('viniz-form-v1|' + base).digest();
}

function signer(horodatage) {
  return crypto.createHmac('sha256', cleSignature()).update(String(horodatage)).digest('hex');
}

/** Comparaison a temps constant, pour ne pas fuiter la signature octet par octet. */
function signatureValide(horodatage, signature) {
  if (typeof signature !== 'string') return false;
  const attendue = Buffer.from(signer(horodatage), 'utf8');
  const fournie = Buffer.from(signature, 'utf8');
  if (attendue.length !== fournie.length) return false;
  return crypto.timingSafeEqual(attendue, fournie);
}

function adresseIp(req) {
  const entete = req.headers['x-forwarded-for'];
  if (typeof entete === 'string' && entete.length) return entete.split(',')[0].trim();
  if (Array.isArray(entete) && entete.length) return String(entete[0]).trim();
  return req.socket && req.socket.remoteAddress ? req.socket.remoteAddress : 'inconnue';
}

/**
 * Limite par IP, en memoire.
 *
 * ATTENTION : une Vercel Function est sans etat entre deux invocations et
 * plusieurs instances tournent en parallele. Ce compteur ne vit que dans une
 * instance chaude. Il arrete une rafale qui retombe sur la meme instance, ce
 * qui est le cas courant, mais il NE CONSTITUE PAS une limite fiable. Une
 * limite reelle demande un stockage partage (Vercel KV, Upstash Redis).
 * C'est documente plutot que maquille.
 */
const envoisParIp = new Map();

function limiteDepassee(ip) {
  const maintenant = Date.now();
  const recents = (envoisParIp.get(ip) || []).filter((t) => maintenant - t < IP_FENETRE_MS);
  if (recents.length >= IP_MAX_ENVOIS) {
    envoisParIp.set(ip, recents);
    return true;
  }
  recents.push(maintenant);
  envoisParIp.set(ip, recents);
  // Purge opportuniste : la Map ne doit pas grossir indefiniment dans une instance chaude.
  if (envoisParIp.size > 500) {
    for (const [cle, valeurs] of envoisParIp) {
      if (!valeurs.some((t) => maintenant - t < IP_FENETRE_MS)) envoisParIp.delete(cle);
    }
  }
  return false;
}

/* ------------------------------------------------------------------ */
/* Validation                                                          */
/* ------------------------------------------------------------------ */

function lireCorps(req) {
  if (req.body && typeof req.body === 'object') return req.body;
  if (typeof req.body === 'string' && req.body.length) {
    try { return JSON.parse(req.body); } catch (e) { return null; }
  }
  return null;
}

function valider(corps) {
  const valeurs = {};
  const erreurs = [];

  for (const [nom, regle] of Object.entries(CHAMPS)) {
    const brut = corps[nom];
    const valeur = typeof brut === 'string' ? brut.trim() : '';
    if (!valeur) {
      if (regle.requis) erreurs.push(`${regle.libelle} est obligatoire.`);
      valeurs[nom] = '';
      continue;
    }
    if (valeur.length < regle.min || valeur.length > regle.max) {
      erreurs.push(`${regle.libelle} doit faire entre ${regle.min} et ${regle.max} caractères.`);
      continue;
    }
    valeurs[nom] = valeur;
  }

  if (valeurs.email && !EMAIL_PLAUSIBLE.test(valeurs.email)) {
    erreurs.push("L'adresse email n'a pas une forme valide.");
  }

  return { valeurs, erreurs };
}

/**
 * Renvoie 'ok', 'trop-rapide' ou 'non-verifie'.
 * 'non-verifie' : le visiteur n'a pas pu obtenir de jeton (GET en echec).
 * On accepte quand meme plutot que de perdre un prospect, mais on le signale
 * dans la notification pour qu'Antoine le voie.
 */
function verifierDuree(corps) {
  const ts = Number(corps.ts);
  const sig = corps.sig;
  if (!ts || !sig) return 'non-verifie';
  if (!signatureValide(ts, sig)) return 'non-verifie';
  const ecoule = Date.now() - ts;
  if (ecoule < 0 || ecoule > AGE_MAX_JETON_MS) return 'non-verifie';
  if (ecoule < DUREE_MIN_SAISIE_MS) return 'trop-rapide';
  return 'ok';
}

/* ------------------------------------------------------------------ */
/* Envois                                                              */
/* ------------------------------------------------------------------ */

async function envoyerEmail(charge) {
  const reponse = await fetch(RESEND_ENDPOINT, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(charge),
  });
  if (!reponse.ok) {
    const detail = await reponse.text().catch(() => '');
    throw new Error(`Resend ${reponse.status} : ${detail.slice(0, 300)}`);
  }
  return reponse.json().catch(() => ({}));
}

function emailNotification(v, meta) {
  const ligne = (libelle, valeur) => `
    <tr>
      <td style="padding:6px 14px 6px 0;color:#6B5E9C;font:600 12px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;white-space:nowrap;vertical-align:top">${echapper(libelle)}</td>
      <td style="padding:6px 0;color:#1B1040;font:400 15px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${valeur}</td>
    </tr>`;

  const alerte = meta.dureeSaisie === 'non-verifie'
    ? `<p style="margin:0 0 18px;padding:10px 14px;background-color:#FFF4D6;border-radius:8px;color:#6B4E00;font:400 13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Durée de saisie non vérifiée : le visiteur n'a pas obtenu de jeton. À regarder si d'autres messages du même genre arrivent.</p>`
    : '';

  return `<!doctype html>
<html lang="fr"><head><meta charset="utf-8"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:24px;background-color:#F4F1FB">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="max-width:640px;margin:0 auto;background-color:#FFFFFF;border-radius:14px">
    <tr><td style="padding:26px 28px">
      <p style="margin:0 0 4px;color:#4825B3;font:600 12px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.08em">NOUVEAU CONTACT</p>
      <h1 style="margin:0 0 20px;color:#1B1040;font:700 22px/1.25 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${echapper(v.nom)} · ${echapper(v.activite)}</h1>
      ${alerte}
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
        ${ligne('Nom', echapper(v.nom))}
        ${ligne('Activité', echapper(v.activite))}
        ${ligne('Email', `<a href="mailto:${echapper(v.email)}" style="color:#4825B3">${echapper(v.email)}</a>`)}
        ${v.tel ? ligne('Téléphone', `<a href="tel:${echapper(v.tel)}" style="color:#4825B3">${echapper(v.tel)}</a>`) : ''}
        ${ligne('Message', echapperMultiligne(v.message))}
      </table>
      <p style="margin:22px 0 0;padding-top:14px;border-top:1px solid #E4DEFB;color:#8F86BF;font:400 12px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
        Reçu le ${echapper(meta.date)}. Réponds directement à cet email, il part chez le prospect.
      </p>
    </td></tr>
  </table>
</body></html>`;
}

/**
 * Accusé de réception, aux couleurs de Viniz.
 *
 * Mode sombre : color-scheme "light only" + background-color explicite sur
 * chaque element. Sans cela Apple Mail inverse les couleurs et le fond sombre
 * ressort en clair avec un texte devenu illisible.
 */
function emailAccuse(v) {
  return `<!doctype html>
<html lang="fr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta name="color-scheme" content="light only">
  <meta name="supported-color-schemes" content="light only">
  <style>
    :root { color-scheme: light only; supported-color-schemes: light only; }
    u + .corps .rien { display: none; }
  </style>
</head>
<body class="corps" bgcolor="#F4F1FB" style="margin:0;padding:24px 12px;background-color:#F4F1FB;color-scheme:light only">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#F4F1FB" style="background-color:#F4F1FB">
    <tr><td align="center" style="background-color:#F4F1FB">

      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#2A1470" style="max-width:560px;background-color:#2A1470;border-radius:22px">

        <tr><td bgcolor="#2A1470" style="background-color:#2A1470;padding:32px 32px 0">
          <p style="margin:0;color:#C8FF3D;font:700 17px/1 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Viniz</p>
        </td></tr>

        <tr><td bgcolor="#2A1470" style="background-color:#2A1470;padding:22px 32px 0">
          <h1 style="margin:0;color:#F3F0FF;font:700 26px/1.2 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Message bien reçu, ${echapper(v.nom)}.</h1>
          <p style="margin:14px 0 0;color:#C8C2E6;font:400 15px/1.65 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
            On te répond sous ${DELAI_REPONSE}. On part de ton planning, pas d'une démonstration générique.
          </p>
        </td></tr>

        <tr><td bgcolor="#2A1470" style="background-color:#2A1470;padding:24px 32px 0">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#1B1040" style="background-color:#1B1040;border-radius:14px">
            <tr><td bgcolor="#1B1040" style="background-color:#1B1040;padding:18px 20px">
              <p style="margin:0 0 10px;color:#8F86BF;font:600 11px/1.4 -apple-system,Segoe UI,Helvetica,Arial,sans-serif;letter-spacing:.1em">CE QUE TU NOUS AS ÉCRIT</p>
              <p style="margin:0 0 6px;color:#C8C2E6;font:400 13px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
                <span style="color:#8F86BF">Activité :</span> ${echapper(v.activite)}
              </p>
              <p style="margin:0;color:#F3F0FF;font:400 14px/1.65 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">${echapperMultiligne(v.message)}</p>
            </td></tr>
          </table>
        </td></tr>

        <tr><td bgcolor="#2A1470" style="background-color:#2A1470;padding:26px 32px 0">
          <p style="margin:0;color:#C8C2E6;font:400 14px/1.65 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
            Une précision à ajouter ? Réponds simplement à cet email.
          </p>
        </td></tr>

        <tr><td bgcolor="#2A1470" style="background-color:#2A1470;padding:26px 32px 32px">
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" bgcolor="#2A1470" style="background-color:#2A1470">
            <tr><td bgcolor="#2A1470" style="background-color:#2A1470;border-top:1px solid rgba(243,240,255,.16);padding-top:18px">
              <p style="margin:0;color:#F3F0FF;font:700 13px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">Viniz</p>
              <p style="margin:4px 0 0;color:#8F86BF;font:400 12px/1.6 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
                Gère ta salle, pas ton logiciel.<br>
                <a href="https://viniz.app/" style="color:#C8FF3D;text-decoration:none">viniz.app</a>
                &nbsp;·&nbsp;
                <a href="mailto:${REPLI_EMAIL}" style="color:#C8FF3D;text-decoration:none">${REPLI_EMAIL}</a>
              </p>
              <p style="margin:10px 0 0;color:#6B5E9C;font:400 11px/1.5 -apple-system,Segoe UI,Helvetica,Arial,sans-serif">
                Édité par Nexxia · Belgique. Tu reçois cet email parce que tu nous as écrit depuis viniz.app.
              </p>
            </td></tr>
          </table>
        </td></tr>

      </table>

    </td></tr>
  </table>
</body></html>`;
}

async function alerterSlack(v) {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) return;
  const extrait = v.message.length > 220 ? v.message.slice(0, 220) + '…' : v.message;
  const texte = [
    `*Nouveau contact* · ${v.nom} · ${v.activite}`,
    `${v.email}${v.tel ? ' · ' + v.tel : ''}`,
    '>' + extrait.replace(/\n/g, '\n>'),
  ].join('\n');
  await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: texte }),
  });
}

/* ------------------------------------------------------------------ */
/* Handler                                                             */
/* ------------------------------------------------------------------ */

module.exports = async (req, res) => {
  // Un jeton horodate et signe : le serveur mesure le temps de saisie sans
  // faire confiance a une horloge fournie par le client.
  if (req.method === 'GET') {
    const ts = Date.now();
    res.setHeader('Cache-Control', 'no-store');
    return res.status(200).json({ ts, sig: signer(ts) });
  }

  if (req.method !== 'POST') {
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ ok: false, erreur: 'Méthode non autorisée.' });
  }

  // Les variables indispensables a la LIVRAISON du prospect. Sans elles on
  // echoue franchement : un formulaire qui « reussit » sans rien envoyer est
  // le pire des cas.
  const manquantes = ['RESEND_API_KEY', 'CONTACT_TO_EMAIL'].filter((n) => !process.env[n]);
  if (manquantes.length) {
    console.error('[contact] Variables absentes :', manquantes.join(', '));
    return res.status(500).json({
      ok: false,
      erreur: "Le formulaire n'est pas configuré côté serveur.",
    });
  }
  // Slack n'est qu'une alerte de confort : son absence ne doit pas couter un prospect.
  if (!process.env.SLACK_WEBHOOK_URL) {
    console.warn("[contact] SLACK_WEBHOOK_URL absente : l'alerte Slack est désactivée.");
  }

  const corps = lireCorps(req);
  if (!corps) return res.status(400).json({ ok: false, erreur: 'Requête illisible.' });

  const ip = adresseIp(req);

  // --- Anti-spam. Un spam repere recoit un SUCCES : lui dire qu'il est repere
  // lui apprend a contourner. Il n'est simplement pas transmis. ---
  const honeypot = typeof corps.website === 'string' ? corps.website.trim() : '';
  if (honeypot) {
    console.warn('[contact] Honeypot rempli, message ignoré. IP', ip);
    return res.status(200).json({ ok: true });
  }

  const duree = verifierDuree(corps);
  if (duree === 'trop-rapide') {
    console.warn('[contact] Soumission en moins de 3 s, message ignoré. IP', ip);
    return res.status(200).json({ ok: true });
  }

  if (limiteDepassee(ip)) {
    console.warn('[contact] Limite par IP atteinte, message ignoré. IP', ip);
    return res.status(200).json({ ok: true });
  }

  // --- Validation serveur, autoritaire ---
  const { valeurs, erreurs } = valider(corps);
  if (erreurs.length) {
    return res.status(400).json({ ok: false, erreur: erreurs[0], erreurs });
  }

  const meta = {
    dureeSaisie: duree,
    date: new Date().toLocaleString('fr-BE', { timeZone: 'Europe/Brussels' }),
  };

  // --- 1. Notification. C'est le prospect : elle DOIT partir. ---
  try {
    await envoyerEmail({
      from: EXPEDITEUR,
      to: [process.env.CONTACT_TO_EMAIL],
      reply_to: valeurs.email,
      subject: `Nouveau contact · ${nettoyerEnTete(valeurs.nom)} · ${nettoyerEnTete(valeurs.activite)}`,
      html: emailNotification(valeurs, meta),
    });
  } catch (e) {
    console.error('[contact] Échec de la notification :', e && e.message);
    return res.status(502).json({
      ok: false,
      erreur: "L'envoi a échoué.",
    });
  }

  // --- 2. Accuse de reception. Best-effort : le prospect compte plus que la politesse. ---
  try {
    await envoyerEmail({
      from: EXPEDITEUR,
      to: [valeurs.email],
      reply_to: process.env.CONTACT_TO_EMAIL,
      subject: 'On a bien reçu ton message · Viniz',
      html: emailAccuse(valeurs),
    });
  } catch (e) {
    console.error('[contact] Accusé de réception non envoyé (notification partie) :', e && e.message);
  }

  // --- 3. Slack. Best-effort egalement. ---
  try {
    await alerterSlack(valeurs);
  } catch (e) {
    console.error('[contact] Alerte Slack en échec (notification partie) :', e && e.message);
  }

  return res.status(200).json({ ok: true });
};
