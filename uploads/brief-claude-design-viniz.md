# Brief — Landing page Viniz

*À coller tel quel dans Claude Design.*

---

Tu es **directeur artistique web**. Je veux une landing page qu'on ne puisse confondre
avec aucune autre — pas un gabarit propre, une vraie signature visuelle. J'ai déjà écarté
une première version parce qu'elle était « correcte mais classique » : trop statique,
pas assez portée par l'image et le mouvement.

---

## LE PRODUIT

**Viniz** — logiciel de réservation pour petites salles de sport, édité par **Nexxia** (Belgique).

Une salle de fitness gère aujourd'hui ses inscriptions dans un tableur, relance ses membres
à la main, et court après les paiements. Viniz prend tout ça : planning des cours,
réservations, liste d'attente, paiements, factures, présences, absences.

**Le point qui nous distingue** : les membres téléchargent une application **au nom de leur
salle**, pas au nôtre. Viniz reste invisible. Le gérant a son app sur l'App Store, avec son
logo, ses couleurs, ses photos.

**Le public** : gérants de salles indépendantes, 30-50 ans, Belgique francophone. Ils ne
sont pas techniques. Ils travaillent debout, dans leur salle, avec leur téléphone.

**La seule chose que la page doit obtenir** : qu'un gérant laisse ses coordonnées.
Pas d'inscription en ligne, pas d'essai gratuit — un formulaire, on le rappelle.

---

## LA MARQUE — non négociable

| Élément | Valeur |
|---|---|
| **Violet Ink** | `#2D1B69` — couleur principale |
| **Violet profond** | `#1B1040` — blocs sombres |
| **Neon Lime** | `#C8FF3D` — accent |
| **Titrage** | MuseoModerno |
| **Baseline** | « Garde le pouls de ta salle. » |
| **Titre du hero** | « Gère ta salle, pas ton logiciel. » |

⚠️ **Contrainte absolue** : le Neon Lime n'est lisible **que sur fond sombre**. Ne jamais
le poser sur du clair. Il n'apparaît donc que dans les blocs violets — ce qui doit créer
le rythme de la page, pas la décorer.

**Le fond général doit être clair et aéré.** Blanc chaud, beaucoup d'air, cartes largement
arrondies. Pas de page sombre.

**Le signe de marque** est une ligne de pouls (type électrocardiogramme) en lime sur carré
violet arrondi. Sers-t'en si ça sert le propos — ne le force pas partout.

---

## CE QUE JE VEUX VISUELLEMENT

C'est là que la première version a échoué. Je veux **du mouvement porté par l'image**, pas
des blocs de texte qui apparaissent en fondu.

**Le vocabulaire d'animation que j'attends** — choisis-en 3 ou 4 et exécute-les bien,
plutôt que tout empiler :

- **Sections collantes** : le visuel reste fixe pendant que le texte défile à côté, et
  l'image change à chaque paragraphe
- **Grille de visuels qui s'assemble** au défilement — les images arrivent de positions
  différentes et se mettent en place
- **Bandeau défilant** d'images ou de mots, en boucle continue
- **Parallaxe mesurée** entre l'arrière-plan et les visuels au premier plan
- **Empilement de cartes** qui se superposent au défilement puis se déploient
- **Révélation par masque** : une image se dévoile derrière une forme qui s'ouvre
- **Micro-interactions au survol** : l'image réagit, se décale, s'agrandit légèrement
- **Carrousel produit** avec transitions franches entre écrans

**Une orchestration vaut mieux que des effets dispersés.** Choisis un moment fort — le hero
ou la section produit — et fais-en quelque chose de mémorable. Le reste reste calme.

**Respecte `prefers-reduced-motion`** : tout doit se couper proprement.

---

## LES IMAGES

Je n'ai pas encore de photos de la salle. **Reconstruis les interfaces en HTML/CSS**
(cadres de téléphone, fenêtres de tableau de bord, grilles de planning) : c'est net à
toutes les résolutions, léger, et modifiable. Elles seront remplacées par de vraies
captures plus tard — prévois-les faciles à substituer.

**Ce que les maquettes doivent montrer** *(données réelles d'une salle cliente)* :

**Planning hebdomadaire** — Lun 7h Hyrox Foundation · 18h Strength — Mar 7h Engine ·
12h30 HIIT · 18h Hyrox Pro — Mer 7h Hyrox Pro · 18h Foundation — Jeu 7h Strength ·
18h Hyrox Pro — Ven 7h Engine · 12h30 Foundation · 18h Strength — Sam 9h30 Engine —
Dim 9h30 HIIT
*Couleurs par cours : Hyrox Pro rouge · Foundation orange · Engine bleu · Strength violet · HIIT ambre*

**Liste de présences** — Julie Lambert (Carte 10 séances, 6 restantes) Présente ·
Thomas Dubois (Illimité 12 mois) Présent · Marie Claes Absente · Lucas Martin En attente

**Revenus** — 4 280 € encaissés ce mois · 1 890 € récurrent · 68 membres actifs

**App membre sur téléphone** — écran d'un cours « STRENGTH », lundi 18:00 → 19:00,
8/12 places, bouton « M'INSCRIRE » en lime sur fond noir

---

## LA STRUCTURE

1. **Navigation** — logo, 4 liens, bouton « Être recontacté »
2. **Hero** — titre, sous-titre, deux boutons, et **le moment visuel fort de la page**
3. **Carrousel produit** — 4 écrans : Planning · Présences · Revenus · App membre
4. **Le problème** — pourquoi Viniz existe, 3 cartes
5. **Ta marque** — bloc sombre, l'app au nom de la salle
6. **Tarifs** — 3 cartes, celle du milieu mise en avant
7. **Témoignage** — un seul, réel
8. **Journal** — 3 articles
9. **Contact** — formulaire : nom, salle, email, téléphone, message
10. **Pied de page**

Page longue, très aérée. La longueur ne me dérange pas si le rythme est bon.

---

## LE CONTENU — à utiliser tel quel

*N'invente pas de texte générique. Voici la matière réelle.*

### Hero
> **Gère ta salle, pas ton logiciel.**
>
> Réservations, paiements, présences : Viniz s'occupe de l'administratif pendant que tu
> t'occupes de tes membres. Et eux réservent depuis une application qui porte le nom de
> ta salle — pas le nôtre.
>
> `Être recontacté` · `Voir le produit`
>
> *Conçu avec une vraie salle, pas dans un bureau.*

### Le problème
> **Une salle, ça se gère le soir. Souvent trop tard.**
>
> Le tableur des inscriptions. Les rappels pour savoir qui a payé. Les messages pour
> prévenir qu'un cours est complet. Les places réservées par des gens qui ne viendront pas.
> Rien de tout ça n'est ton métier — et pourtant c'est ce qui prend tes soirées.

**Trois cartes :**
- **Le planning se remplit seul** — Tu poses tes cours une fois, ils se répètent. Tes membres réservent, la liste d'attente propose les places libérées à la personne suivante.
- **L'argent rentre sans toi** — Paiement en ligne ou au comptoir, la facture part automatiquement. Tu vois ce que tu as encaissé, sans rien ressaisir.
- **Les présences en dix secondes** — Tu pointes depuis ton téléphone, debout dans la salle. Les absences suivent la politique que tu as fixée.

### Ta marque
> **Tes membres téléchargent l'app de ta salle.**
>
> Ton nom, tes couleurs, tes photos, ton logo sur l'écran d'accueil. Viniz reste invisible :
> c'est ton club qu'ils ouvrent chaque matin, pas un logiciel de plus.

- **Ton app sur l'App Store** — Publiée à ton nom, avec ta fiche et tes visuels.
- **Tes cours, tes photos** — Tu changes une image depuis ton tableau de bord. C'est en ligne tout de suite.
- **Tes règles** — Délais d'annulation, absences, limites de réservation : tu les fixes, l'app les applique.

### Tarifs
**Starter — 99 €/mois, jusqu'à 50 membres.** Pour une salle qui démarre et veut arrêter le tableur.
Planning et réservations · App membre à ta marque · Paiements et factures · Présences et liste d'attente

**Pro — 200 €/mois, jusqu'à 200 membres.** *(mis en avant)* Pour une salle installée, avec plusieurs coachs.
Tout Starter, plus : Comptes coachs séparés · Suivi des revenus et de l'assiduité · Relance des membres inactifs

**Premium — 350 €/mois, membres illimités.** Pour une salle qui grandit, ou plusieurs adresses.
Tout Pro, plus : Prélèvement automatique · Plusieurs salles, un tableau de bord · Accompagnement dédié

### Témoignage
> « C'est moi qui me prends la tête. Je me mets un rappel pour chaque client. »
>
> C'est comme ça que Nico gérait sa salle avant Viniz. Aujourd'hui, ses membres réservent
> seuls et ses paiements arrivent sans qu'il y pense.
>
> **Nicolas Parmentier** — Dopamine Performance Club, Ougrée

### Journal — trois titres
- *Pourquoi une absence ne devrait jamais être automatique* — Gestion
- *Encaisser au comptoir sans perdre sa comptabilité* — Paiements
- *La liste d'attente qui ne débite personne pour rien* — Membres

### Contact
> **On regarde ensemble si Viniz te convient.**
>
> Laisse tes coordonnées, on te rappelle. Pas de démonstration générique : on part de ton
> planning et de tes formules.

---

## CE QU'IL NE FAUT SURTOUT PAS FAIRE

⚠️ **Aucune preuve sociale inventée.** Pas de « 4.9/5 par 5 000 clients », pas de logos
partenaires, pas de compteurs à quatre chiffres, pas de témoignages fictifs. Nous avons
**une** salle cliente. Inventer le reste serait illégal en Belgique et immédiatement
repérable dans un marché où les gérants se connaissent.

**Notre force est l'inverse** : une vraie salle, un vrai gérant, un produit qui tourne
depuis des mois. La page doit assumer ça comme un argument, pas le cacher.

**Pas de vocabulaire d'agence.** Pas de « solutions innovantes », « transformation
digitale », « propulsé par l'IA ». On parle à un gérant de salle : phrases courtes,
verbes concrets, tutoiement.

**Pas de dégradé violet-rose générique.** La palette est celle de la marque, point.

---

## LA LIVRAISON

Un fichier HTML autonome — CSS et JavaScript inclus, aucune dépendance hors Google Fonts.
Il doit s'ouvrir dans un navigateur et se déployer sur Vercel sans build.

**Le socle de qualité** : responsive jusqu'au mobile, focus clavier visible,
`prefers-reduced-motion` respecté, contrastes AA, images de substitution faciles à
remplacer.

**Marque en commentaire dans le code** : le formulaire n'est pas connecté, les tarifs
restent à confirmer, les articles du journal n'existent pas encore.

---

Commence par me proposer **ta direction artistique en quelques lignes** — palette, choix
typographiques, et surtout **le moment visuel signature** de la page. Je valide avant que
tu écrives le code.
