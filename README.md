# 🏆 Podium de Concours - Application Full-Stack

Application web complète de gestion de concours avec gamification, permettant aux équipes de participer à des défis, de gagner des points et de se classer en temps réel.

## 📋 Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Architecture](#architecture)
- [Prérequis](#prérequis)
- [Installation](#installation)
- [Configuration](#configuration)
- [Lancement de l'application](#lancement-de-lapplication)
- [Comptes de test](#comptes-de-test)
- [Structure du projet](#structure-du-projet)
- [Technologies utilisées](#technologies-utilisées)
- [API Documentation](#api-documentation)

## 🎯 Description

**Podium de Concours** est une plateforme de gamification permettant de gérer des concours entre équipes. L'application comprend :

- **Backend** : API REST sécurisée avec WebSocket pour les mises à jour en temps réel
- **Frontend Admin** : Interface d'administration pour gérer les équipes, défis, scores et demandes
- **Frontend User** : Interface utilisateur pour les leaders et membres d'équipe

## ✨ Fonctionnalités

### 🔐 Authentification et Gestion des Utilisateurs

- **Inscription et connexion** avec JWT
- **Rôles** : Admin, Leader, Member
- **Validation des comptes** :
  - Les leaders doivent être approuvés par un admin
  - Les membres doivent être acceptés par leur leader
- **Gestion des statuts** : pending, active, blocked

### 👥 Gestion des Équipes

- **Création d'équipes** par les admins avec affectation de leader
- **Demande d'adhésion** : Les utilisateurs peuvent demander à rejoindre une équipe
- **Gestion des membres** : Les leaders peuvent accepter/refuser les demandes d'adhésion
- **Classement en temps réel** avec WebSocket
- **Badges et récompenses** pour les équipes

### 🎯 Gestion des Défis

- **Création de défis** par les admins (défis principaux et mini-défis)
- **Attribution de points** selon la difficulté
- **Délais et ressources** pour chaque défi
- **Activation/désactivation** des défis

### 📊 Gestion des Scores

- **Soumission de scores** par les leaders
- **Validation des scores** par les admins
- **Statuts** : pending, validated, rejected
- **Calcul automatique** des points selon le défi
- **Historique des scores** par équipe

### 💬 Système de Motivation

- **Messages motivants** : Les leaders peuvent envoyer des messages à leurs membres
- **Réactions** : Les membres peuvent réagir aux messages (like, love, clap, rocket)
- **Notifications en temps réel** via WebSocket

### 📈 Dashboard Admin

- **Vue d'ensemble** avec statistiques
- **Gestion des équipes** : Création, modification, suppression
- **Gestion des défis** : Création, modification, activation/désactivation
- **Validation des scores** : Approbation ou rejet des scores soumis
- **Gestion des demandes de leader** : Approbation ou rejet des demandes
- **Classement des équipes** en temps réel

### 👨‍💼 Dashboard Leader

- **Vue d'ensemble** de l'équipe avec statistiques
- **Gestion des membres** : Voir les membres, inviter, retirer
- **Gestion des demandes d'adhésion** : Accepter ou refuser les demandes
- **Soumission de scores** pour les défis complétés
- **Envoi de messages motivants** aux membres
- **Classement en temps réel**

### 👤 Dashboard Member

- **Vue d'ensemble** de l'équipe
- **Consultation des défis** disponibles
- **Visualisation du classement** en temps réel
- **Réception et réaction** aux messages motivants
- **Suivi des badges** de l'équipe

## 🏗️ Architecture

```
Podium-concours/
├── backend/          # API REST + WebSocket (Node.js/Express)
├── admin/            # Frontend Admin (React)
└── frontend/         # Frontend User (React)
```

### Backend

- **Framework** : Express.js
- **Base de données** : MongoDB avec Mongoose
- **Authentification** : JWT (JSON Web Tokens)
- **Temps réel** : Socket.IO
- **Validation** : express-validator
- **Sécurité** : bcrypt pour le hashage des mots de passe, Helmet pour la sécurité HTTP

### Frontend Admin

- **Framework** : React 18
- **Routing** : React Router v6
- **Styling** : Tailwind CSS
- **HTTP Client** : Axios
- **Icons** : Lucide React
- **Temps réel** : Socket.IO Client

### Frontend User

- **Framework** : React 19
- **Routing** : React Router v7
- **Styling** : Tailwind CSS
- **HTTP Client** : Axios
- **Icons** : Lucide React
- **Temps réel** : Socket.IO Client

## 📦 Prérequis

Avant de commencer, assurez-vous d'avoir installé :

- **Node.js** (version 18 ou supérieure)
- **npm** (version 9 ou supérieure)
- **MongoDB** (version 6 ou supérieure) - Installé localement ou MongoDB Atlas

## 🚀 Installation

### 1. Cloner le projet

```bash
git clone <repository-url>
cd Podium-concours
```

### 2. Installer les dépendances du Backend

```bash
cd backend
npm install
```

### 3. Installer les dépendances du Frontend Admin

```bash
cd ../admin
npm install
```

### 4. Installer les dépendances du Frontend User

```bash
cd ../frontend
npm install
```

## ⚙️ Configuration

### Backend

1. Créer un fichier `.env` dans le dossier `backend/` :

```env
# Port du serveur
PORT=5000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/podium-concours

# JWT Secret (générez une clé secrète aléatoire)
JWT_SECRET=votre_cle_secrete_jwt_tres_longue_et_aleatoire

# URLs des frontends (pour CORS et WebSocket)
ADMIN_FRONTEND_URL=http://localhost:3001
USERS_FRONTEND_URL=http://localhost:3000

# Environnement
NODE_ENV=development
```

2. Générer une clé JWT secrète :

```bash
# Sur Linux/Mac
openssl rand -base64 32

# Sur Windows (PowerShell)
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Frontend Admin

Créer un fichier `.env` dans le dossier `admin/` (optionnel) :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

### Frontend User

Créer un fichier `.env` dans le dossier `frontend/` (optionnel) :

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 🎬 Lancement de l'application

### 1. Démarrer MongoDB

**MongoDB local :**

```bash
# Sur Linux/Mac
sudo systemctl start mongod

# Sur Windows
# Démarrer MongoDB depuis les services Windows ou via MongoDB Compass
```

**MongoDB Atlas :**

Si vous utilisez MongoDB Atlas, mettez à jour `MONGODB_URI` dans le fichier `.env` du backend avec votre chaîne de connexion.

### 2. Initialiser la base de données (Seed)

```bash
cd backend
npm run seed
```

Cette commande va :
- Nettoyer la base de données
- Créer des utilisateurs de test (admin, leaders, members)
- Créer des défis
- Créer des équipes
- Créer des scores

### 3. Démarrer le Backend

```bash
cd backend
npm run dev
```

Le serveur backend sera accessible sur `http://localhost:5000`

### 4. Démarrer le Frontend Admin

Ouvrir un nouveau terminal :

```bash
cd admin
npm start
```

Le frontend admin sera accessible sur `http://localhost:3001`

### 5. Démarrer le Frontend User

Ouvrir un nouveau terminal :

```bash
cd frontend
npm start
```

Le frontend user sera accessible sur `http://localhost:3000`

## 🔑 Comptes de test

Après avoir exécuté `npm run seed`, vous pouvez vous connecter avec :

### Admin
- **Email** : `admin@podium.com`
- **Mot de passe** : `admin123`
- **Accès** : Dashboard admin complet

### Leader (Actif)
- **Email** : `ahmed.leader@podium.com`
- **Mot de passe** : `leader123`
- **Accès** : Dashboard leader avec équipe

### Leader (En attente)
- **Email** : `amira.leader@podium.com`
- **Mot de passe** : `leader123`
- **Statut** : En attente d'approbation par l'admin

### Member
- **Email** : `sara.member@podium.com`
- **Mot de passe** : `member123`
- **Accès** : Dashboard membre

## 📁 Structure du projet

```
Podium-concours/
├── backend/
│   ├── src/
│   │   ├── config/          # Configuration (database, jwt)
│   │   ├── controllers/     # Logique métier
│   │   ├── middleware/      # Middlewares (auth, roleCheck, errorHandler)
│   │   ├── models/          # Modèles Mongoose (User, Team, Challenge, Score, Request, Motivation)
│   │   ├── routes/          # Routes API
│   │   ├── scripts/         # Scripts (seed.js)
│   │   ├── utils/           # Utilitaires (validators, responses)
│   │   └── server.js        # Point d'entrée du serveur
│   ├── .env                 # Variables d'environnement
│   └── package.json
│
├── admin/
│   ├── src/
│   │   ├── components/      # Composants React
│   │   │   ├── admin/        # Composants admin (Dashboard, TeamsManagement, etc.)
│   │   │   ├── auth/         # Composants d'authentification
│   │   │   └── common/        # Composants communs
│   │   ├── context/          # Context API (AuthContext)
│   │   ├── hooks/            # Hooks personnalisés
│   │   ├── services/         # Services API (api.js, authService, etc.)
│   │   ├── utils/            # Utilitaires
│   │   └── App.jsx           # Composant principal
│   ├── .env                  # Variables d'environnement (optionnel)
│   └── package.json
│
└── frontend/
    ├── src/
    │   ├── components/       # Composants React
    │   │   ├── leader/       # Composants leader
    │   │   ├── member/       # Composants member
    │   │   └── common/       # Composants communs
    │   ├── context/          # Context API (AuthContext)
    │   ├── pages/            # Pages (Login, Register, etc.)
    │   ├── services/         # Services API
    │   └── App.js            # Composant principal
    ├── .env                  # Variables d'environnement (optionnel)
    └── package.json
```

## 🛠️ Technologies utilisées

### Backend
- **Node.js** : Runtime JavaScript
- **Express.js** : Framework web
- **MongoDB** : Base de données NoSQL
- **Mongoose** : ODM pour MongoDB
- **Socket.IO** : Communication temps réel
- **JWT** : Authentification
- **bcryptjs** : Hashage des mots de passe
- **express-validator** : Validation des données
- **Helmet** : Sécurité HTTP
- **CORS** : Gestion des CORS
- **Morgan** : Logging HTTP

### Frontend
- **React** : Bibliothèque UI
- **React Router** : Routing
- **Tailwind CSS** : Framework CSS
- **Axios** : Client HTTP
- **Socket.IO Client** : Client WebSocket
- **Lucide React** : Icons
- **jwt-decode** : Décodage JWT

## 📡 API Documentation

### Endpoints principaux

#### Authentification
- `POST /api/auth/register` - Inscription
- `POST /api/auth/login` - Connexion
- `GET /api/auth/me` - Profil utilisateur

#### Utilisateurs (Admin)
- `GET /api/users` - Liste des utilisateurs
- `GET /api/users/leader-requests` - Demandes de leader
- `PUT /api/users/:id/leader-status` - Approuver/Rejeter un leader

#### Équipes
- `GET /api/teams` - Liste des équipes
- `GET /api/teams/leaderboard` - Classement
- `POST /api/teams` - Créer une équipe (Admin/Leader)
- `PUT /api/teams/:id` - Modifier une équipe

#### Défis
- `GET /api/challenges` - Liste des défis
- `POST /api/challenges` - Créer un défi (Admin)
- `PUT /api/challenges/:id` - Modifier un défi

#### Scores
- `GET /api/scores/pending` - Scores en attente (Admin)
- `POST /api/scores` - Soumettre un score (Leader)
- `PUT /api/scores/:id/validate` - Valider un score (Admin)

#### Demandes d'adhésion
- `POST /api/requests` - Soumettre une demande (Public)
- `GET /api/requests/team` - Demandes de l'équipe (Leader)
- `PUT /api/requests/:id/accept` - Accepter une demande (Leader)
- `PUT /api/requests/:id/reject` - Refuser une demande (Leader)

#### Motivations
- `POST /api/motivations` - Envoyer un message (Leader)
- `GET /api/motivations/team/:teamId` - Messages de l'équipe
- `POST /api/motivations/:motivationId/react` - Réagir à un message

### WebSocket Events

- `leaderboard-updated` - Mise à jour du classement
- `score-updated` - Mise à jour d'un score
- `motivation:new` - Nouveau message motivant
- `motivation:react` - Réaction à un message

## 🔒 Sécurité

- **Authentification JWT** : Tokens sécurisés pour l'authentification
- **Hashage des mots de passe** : bcrypt avec salt
- **Validation des données** : express-validator
- **CORS configuré** : Accès restreint aux frontends autorisés
- **Helmet** : Headers de sécurité HTTP
- **Middleware d'authentification** : Protection des routes
- **Contrôle d'accès basé sur les rôles** : Admin, Leader, Member

## 🐛 Dépannage

### Le backend ne démarre pas
- Vérifier que MongoDB est démarré
- Vérifier que le port 5000 n'est pas utilisé
- Vérifier les variables d'environnement dans `.env`

### Les frontends ne se connectent pas au backend
- Vérifier que le backend est démarré
- Vérifier l'URL de l'API dans les fichiers `.env`
- Vérifier les erreurs CORS dans la console du navigateur

### Les demandes ne s'affichent pas
- Vérifier les logs dans la console du navigateur (F12)
- Vérifier les logs du backend
- Vérifier que l'utilisateur est bien connecté avec le bon rôle

### Erreur de connexion MongoDB
- Vérifier que MongoDB est démarré
- Vérifier la chaîne de connexion dans `.env`
- Vérifier les permissions MongoDB

## 📝 Notes

- Les mots de passe sont hashés automatiquement lors de la création
- Les scores sont validés manuellement par les admins
- Les leaders doivent être approuvés avant de pouvoir créer une équipe
- Les membres doivent être acceptés par leur leader avant de pouvoir se connecter
- Le classement se met à jour en temps réel via WebSocket

## 👥 Auteurs

Développé pour le projet "Podium de Concours"

## 📄 Licence

Ce projet est un projet éducatif.

---

**Bon développement ! 🚀**
