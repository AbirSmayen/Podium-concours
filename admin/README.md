# 🎯 Admin Dashboard - Gestion des Équipes et Défis

Interface d'administration complète pour gérer les équipes, défis, scores et demandes de leader.

## 📋 Fonctionnalités

### ✅ Déjà implémentées
- ✨ **Dashboard** : Vue d'ensemble avec statistiques et classement
- 👥 **Gestion des équipes** : Créer, modifier, supprimer
- 🎯 **Gestion des défis** : Créer, modifier, supprimer (Principal/Mini)
- ✅ **Validation des scores** : Approuver ou rejeter les soumissions
- 📝 **Demandes de leader** : Approuver ou rejeter les candidatures
- 🔐 **Authentification** : Connexion sécurisée avec JWT
- 📱 **Responsive** : Fonctionne sur mobile et desktop

## 🚀 Installation

### Prérequis
- Node.js (v14 ou supérieur)
- npm ou yarn
- Backend API déjà configuré

### Étapes d'installation

1. **Cloner ou créer le projet**
```bash
npx create-react-app admin-dashboard
cd admin-dashboard
```

2. **Installer les dépendances**
```bash
npm install axios react-router-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

3. **Copier tous les fichiers**
Copiez tous les fichiers fournis dans la structure appropriée :
```
admin-dashboard/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── admin/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── TeamsManagement.jsx
│   │   │   ├── ChallengesManagement.jsx
│   │   │   ├── ScoresValidation.jsx
│   │   │   ├── LeaderRequests.jsx
│   │   │   └── Modal.jsx
│   │   ├── common/
│   │   │   ├── Header.jsx
│   │   │   ├── Navigation.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── Loading.jsx
│   │   └── auth/
│   │       ├── Login.jsx
│   │       └── ProtectedRoute.jsx
│   ├── services/
│   │   ├── api.js
│   │   ├── authService.js
│   │   ├── teamsService.js
│   │   ├── challengesService.js
│   │   └── scoresService.js
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── hooks/
│   │   ├── useAuth.js
│   │   └── useApi.js
│   ├── utils/
│   │   ├── constants.js
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── .env
├── .gitignore
├── package.json
├── tailwind.config.js
└── README.md
```

4. **Configurer les variables d'environnement**
Créez un fichier `.env` à la racine :
```env
REACT_APP_API_URL=http://localhost:5000/api
```

5. **Démarrer l'application**
```bash
npm start
```

L'application sera accessible sur `http://localhost:3000`

## 🔧 Configuration du Backend

Assurez-vous que votre backend expose les routes suivantes :

### Authentification
- `POST /api/users/login` - Connexion admin

### Équipes
- `GET /api/teams` - Liste des équipes
- `POST /api/teams` - Créer une équipe
- `PATCH /api/teams/:id` - Modifier une équipe
- `DELETE /api/teams/:id` - Supprimer une équipe

### Défis
- `GET /api/challenges` - Liste des défis
- `POST /api/challenges` - Créer un défi
- `PATCH /api/challenges/:id` - Modifier un défi
- `DELETE /api/challenges/:id` - Supprimer un défi

### Scores
- `GET /api/scores?status=pending` - Scores en attente
- `PATCH /api/scores/:id/validate` - Valider un score

### Demandes de leader
- `GET /api/users/leader-requests` - Liste des demandes
- `POST /api/users/leader-requests/:id/approve` - Approuver
- `POST /api/users/leader-requests/:id/reject` - Rejeter

## 📝 Format des données attendues

### Équipe (Team)
```json
{
  "_id": "string",
  "name": "string",
  "logo": "string (emoji)",
  "score": number,
  "members": ["userId1", "userId2"],
  "badges": ["badge1", "badge2"]
}
```

### Défi (Challenge)
```json
{
  "_id": "string",
  "title": "string",
  "description": "string",
  "type": "principal | mini",
  "points": number,
  "deadline": "date ISO",
  "resources": ["url1", "url2"]
}
```

### Score
```json
{
  "_id": "string",
  "teamId": "string",
  "teamName": "string",
  "challengeId": "string",
  "challengeTitle": "string",
  "pointsEarned": number,
  "submittedBy": "string",
  "date": "date ISO",
  "status": "pending | validated | rejected"
}
```

## 🎨 Personnalisation

### Modifier les couleurs
Éditez `tailwind.config.js` pour personnaliser le thème :
```javascript
theme: {
  extend: {
    colors: {
      primary: {
        500: '#6366f1', // Votre couleur principale
        600: '#4f46e5',
        // ...
      }
    }
  }
}
```

### Ajouter des fonctionnalités
1. Créez un nouveau composant dans `src/components/admin/`
2. Importez-le dans `App.jsx`
3. Ajoutez-le dans la navigation

## 🐛 Dépannage

### Erreur CORS
Si vous avez des erreurs CORS, configurez votre backend pour accepter les requêtes depuis `http://localhost:3000` :
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### Token expiré
Le token JWT est automatiquement géré. Si expiré, l'utilisateur est redirigé vers la page de connexion.

### Erreur de connexion à l'API
Vérifiez que :
1. Le backend est bien démarré
2. L'URL dans `.env` est correcte
3. Les routes API correspondent

## 📦 Build pour production

```bash
npm run build
```

Les fichiers optimisés seront dans le dossier `build/`

## 🔐 Sécurité

- ✅ Authentification JWT
- ✅ Routes protégées
- ✅ Vérification du rôle admin
- ✅ Validation des formulaires
- ✅ Gestion des erreurs

## 📚 Technologies utilisées

- **React 18** - Framework frontend
- **React Router v6** - Routage
- **Tailwind CSS** - Styles
- **Axios** - Requêtes HTTP
- **Lucide React** - Icônes
- **Context API** - Gestion d'état

## 🤝 Collaboration avec l'équipe

### Pour le développeur Backend
- Assurez-vous que toutes les routes API sont implémentées
- Respectez les formats de données JSON
- Activez CORS pour `http://localhost:3000`

### Pour les développeurs Leader/Member
- Vous pouvez réutiliser les composants de `src/components/common/`
- Utilisez les mêmes services dans `src/services/`
- Gardez le même style Tailwind CSS

## 📧 Contact

Pour toute question, contactez l'équipe de développement.

---

**Bon développement ! 🚀**