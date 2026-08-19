# ViNiZ — Brand Guide (v2)

> Fiche de marque à coller dans une conversation Claude pour **adapter l'app existante** à l'identité validée.
> Produit : SaaS de gestion pour gérants de salle de sport / studio.
> Baseline : **« Garde le pouls de ta salle. »** (EN : *Keep your studio's pulse.*)
> Direction validée : **Néon Vif** — le battement rendu visible. Vif, vivant, non genré.

---

## 1. Couleurs

Règle d'usage : **60 / 30 / 10** (primaire / secondaire / accent) + 2 couleurs de texte.
Valeurs sRGB exactes — à saisir dans le champ hexadécimal (ne pas pipeter une capture).

### Mode sombre (principal)
| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire · 60% | Violet Ink | `#2D1B69` | Fonds principaux |
| Secondaire · 30% | Violet surface | `#3A2585` | Cartes, surfaces élevées |
| Accent · 10% | Neon Lime | `#C8FF3D` | CTA, focus, highlights |
| Texte 1 | Texte clair | `#F3F0FF` | Titres, texte principal |
| Texte 2 | Lavande | `#C8C2E6` | Texte secondaire, légendes |

### Mode clair (alternatif)
| Rôle | Nom | Hex | Usage |
|---|---|---|---|
| Primaire · 60% | Pale Lilac | `#F6F4FF` | Fond de page |
| Secondaire · 30% | Violet Ink | `#2D1B69` | UI, boutons, texte fort |
| Accent · 10% | Neon Lime | `#C8FF3D` | Accent — **fonds sombres uniquement** |
| Texte 1 | Violet Ink | `#2D1B69` | Titres, texte principal |
| Texte 2 | Violet doux | `#6B5E9C` | Texte secondaire |
| Surface | Blanc | `#FFFFFF` | Cartes · bordure `#E4DEFB` |

### Règle d'accessibilité — impérative
- **Le Neon Lime `#C8FF3D` ne vit que sur fond sombre** (violet ink). Sur fond clair il échoue au contraste : y utiliser le violet ink à la place.
- En mode clair : boutons = violet ink `#2D1B69` avec texte lime `#C8FF3D` (contraste OK), ou texte lime réservé aux surfaces sombres (app-icon, puces).

---

## 2. Typographie

| Emploi | Police | Poids | Notes |
|---|---|---|---|
| Titres / logotype (V, N, Z) | **MuseoModerno** | 700 | Google Fonts |
| Texte secondaire / UI | **Helvetica Now Display** | Bold fourni | Licence client — un seul poids (Bold) disponible pour l'instant |
| Data / mono / accents « codés » | JetBrains Mono | 400–600 | Optionnel |

- Pour l'app, si Helvetica Now Display n'est dispo qu'en Bold : l'utiliser pour labels/CTA/titres courts, et prévoir un **fallback système** (`-apple-system, Segoe UI, sans-serif`) pour le corps de texte long, ou récupérer les poids Regular/Medium.
- Substitut web de MuseoModerno pour maquette rapide : proche de **Fredoka** (rondeurs) — mais la vraie face est MuseoModerno.

---

## 3. Logotype — ViNiZ

Casse du logo : **V** `i` **N** `i` **Z** — capitales V/N/Z, `i` minuscules custom.
- **V · N · Z** : MuseoModerno Bold. Les trois lettres sont **entièrement arrondies et cohérentes** entre elles (le « N » arrondi est un choix assumé, pas une faute — le contexte du nom lève toute ambiguïté).
- **Premier `i`** : le point est remplacé par une **oscillation / heartbeat** (le « pulse-V ») — variante **renforcée** validée (pic haut, trait moyen, plus fin que les lettres pour garder la tension « battement »).
- **Second `i`** : le point est un **point rond simple**. *(On ne met volontairement qu'UN seul effet — le pulse sur le 1ᵉʳ i — pour éviter la répétition. Pas de sparkle.)*
- Le logo maître existe en SVG (fourni par le client).

Idée directrice : **le creux du tracé forme un V** (validation / initiale Viniz) **puis remonte en pic** (battement). Un seul geste = valider + vie.

### Casse en texte courant
Le logo garde sa casse mixte (**ViNiZ**), mais dans un texte écrit (site, posts, docs) on écrit le nom normalement : **« Viniz »** (ou « viniz » en registre bas de casse). La casse mixte est réservée au **design du logo**.

---

## 4. App-icon

- Forme : **carré arrondi** (squircle), rayon ≈ **22%** du côté.
- Contenu : le **pulse-V renforcé**, centré, occupant ~60–66% de l'icône. *(C'est ici que le pulse est mis en avant — sur le wordmark il reste discret, sur l'icône il est le héros.)*
- Variantes :
  - **Principale** : fond `#2D1B69`, tracé `#C8FF3D`.
  - **Alt énergique** : fond `#C8FF3D`, tracé `#2D1B69`.
  - **Mono / white-label** : fond clair `#FFFFFF`/`#F3F0FF`, tracé `#2D1B69`.
- Petits formats (32 / 16 px) : **épaissir le trait** et simplifier le tracé (garder le V + le pic) pour rester lisible.

---

## 5. Application à l'app (pistes)

- **Structure couleur** : fond violet ink en sombre / pale lilac en clair ; cartes en surface secondaire ; **lime réservé aux actions et états actifs** (CTA, sélection, confirmation, focus).
- **Boutons primaires** : pill (border-radius 999px), lime sur violet en sombre / violet sur clair.
- **Confirmations & états « vivants »** : utiliser le motif pulse-V (résa confirmée, salle qui se remplit, temps réel).
- **White-label** : l'app cliente peut porter le nom du studio ; ViNiZ signe discrètement (« propulsé par ViNiZ »), l'icône pulse-V reste la constante.
- **Ton** : direct, vivant, non genré. FR par défaut, EN dispo.

### À éviter
- Lime sur fond clair (contraste).
- Dégradés criards, emojis, clichés « fitness » (haltères, flammes).
- Épaissir l'oscillation jusqu'à l'épaisseur des lettres (on perd le « signal »).

---

## 6. Accroches & baselines (banque de contenu FR / EN)

**Paire officielle :**
- **Signature** (sous le logo) : **Garde le pouls de ta salle.** / *Keep your studio's pulse.*
- **Hero** (site, positionnement) : **Gère ta salle, pas ton logiciel.** / *Run your studio, not your software.*

*(Note EN : « studio » est retenu partout — non genré, couvre yoga/Pilates ET HIIT. Pour un segment 100 % Hyrox/cross international, « Run your gym, not your software » est une alternative.)*

### 🫀 Vitalité / marque
| FR | EN |
|---|---|
| Fais vivre ta salle. | Bring your studio to life. |
| Donne du rythme à tes cours. | Give your classes rhythm. |
| Ta salle sous adrénaline. | Your studio, wired for energy. |
| Là où ça bouge. | Where it moves. |

### 🧠 Bénéfice malin (anti-usine-à-gaz)
| FR | EN |
|---|---|
| Gère ta salle, pas ton logiciel. | Run your studio, not your software. |
| Le logiciel bosse. Toi, tu coaches. | The software works. You coach. |
| Moins d'admin, plus de vie. | Less admin, more life. |
| Passe moins de temps sur l'écran, plus sur le tapis. | Spend less time on screens, more on the floor. |
| Ta résa tourne toute seule. Toi, tu respires. | Your bookings run themselves. You breathe. |
| Un logiciel qui bosse pour toi, pas l'inverse. | Software that works for you, not the other way around. |
| Fini les tableurs et les relances à la main. | No more spreadsheets, no more chasing payments. |
| Reprends les soirées que ton ancien logiciel te volait. | Take back the evenings your old software stole. |
| Pensé pour les indés, pas pour les usines à gaz. | Built for indies, not for bloated machines. |

### 📈 Preuve / résultat
| FR | EN |
|---|---|
| Des cours pleins, des membres fidèles. | Full classes, loyal members. |
| Remplis tes cours. Garde tes membres. | Fill your classes. Keep your members. |
| Moins de no-shows, plus de présents. | Fewer no-shows, more show-ups. |

### 🤝 Humain / allié
| FR | EN |
|---|---|
| Ton coéquipier de gestion. | Your ops teammate. |
| À tes côtés, pas dans ton dos. | By your side, not behind your back. |
| Le logiciel qui te répond vraiment. | Software that actually answers. |

### 💬 Punchlines réseaux sociaux
| FR | EN |
|---|---|
| Viniz. Et ça repart. | Viniz. And it's back on. |
| Réserve. Bouge. Recommence. | Book. Move. Repeat. |
| La salle est pleine. Le stress est vide. | Full room. Zero stress. |
| Ton coach a (enfin) un coéquipier. | Your coach finally has a teammate. |

---

## 7. Aide-mémoire hex (copier-coller)

```
Violet Ink      #2D1B69
Violet surface  #3A2585
Neon Lime       #C8FF3D
Texte clair     #F3F0FF
Lavande         #C8C2E6
Pale Lilac      #F6F4FF   (mode clair)
Violet doux     #6B5E9C   (texte 2 clair)
Bordure claire  #E4DEFB
```

Polices : **MuseoModerno** (titres) · **Helvetica Now Display** (texte) · JetBrains Mono (accent).
Baseline : **Garde le pouls de ta salle.** / *Keep your studio's pulse.*
