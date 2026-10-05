# Site du mariage – Narjes & Isiah

## Contenu

| Fichier | Rôle |
|---|---|
| `index.html` | Le site des invités |
| `config.js` | **Toutes les infos** (date, lieux, programme, témoins, FAQ, Firebase) : c'est le seul fichier à modifier |
| `style.css` / `app.js` | Design et fonctionnement |
| `admin.html` / `admin.js` | Espace mariés (connexion) : liste des réponses, compteurs, export Excel, playlist |
| `photo.jpg` | La photo de l'en-tête (remplaçable par une autre portant le même nom) |
| `firestore.rules` | Règles de sécurité à copier dans Firebase |

## 1. Mettre en ligne sur GitHub Pages

1. Sur votre compte GitHub, créez un nouveau dépôt **public** (ex. `mariage`).
2. *Add file → Upload files* : glissez tous les fichiers du dossier (pas le dossier lui-même), puis *Commit changes*.
3. *Settings → Pages* : Source = *Deploy from a branch*, branche `main`, dossier `/ (root)`, *Save*.
4. Après 1 à 2 minutes, le site est en ligne : `https://<votre-compte>.github.io/mariage/`
   L'espace mariés : `https://<votre-compte>.github.io/mariage/admin.html`

## 2. Activer le formulaire (Firebase, projet dédié)

1. https://console.firebase.google.com → *Ajouter un projet* (ex. `mariage-narjes-isiah`). Google Analytics inutile.
2. **Firestore Database** → *Créer une base de données* → région `eur3 (europe-west)` → mode **production**.
3. Onglet *Règles* : collez le contenu de `firestore.rules`, **remplacez les deux e-mails** par les vôtres, puis *Publier*.
4. **Authentication** → *Commencer* → activer *Adresse e-mail/Mot de passe* → onglet *Utilisateurs* → *Ajouter un utilisateur* (vous, et Narjes si elle veut aussi accéder aux réponses). Utilisez les mêmes e-mails que dans les règles.
5. Authentication → *Paramètres* → *Domaines autorisés* → ajoutez `<votre-compte>.github.io`.
6. ⚙️ *Paramètres du projet* → *Vos applications* → icône `</>` (Web) → enregistrez l'app → copiez l'objet `firebaseConfig` dans `config.js` (partie `firebase`), puis renvoyez `config.js` sur GitHub.

Testez : envoyez une réponse depuis le site, puis connectez-vous sur `admin.html`.

## Modifier une info

Ouvrez `config.js` sur GitHub → crayon ✏️ → modifiez → *Commit changes*. Le site se met à jour en 1 minute.
