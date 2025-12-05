require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');

// Initialisation de l'application
const app = express();

// Connexion à la base de données
connectDB();

// Middlewares globaux
app.use(helmet()); // Sécurité des headers HTTP
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json()); // Parser JSON
app.use(express.urlencoded({ extended: true })); // Parser URL-encoded
app.use(morgan(process.env.NODE_ENV === 'development' ? 'dev' : 'combined')); // Logging

// Route de santé (Health check)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'API Podium fonctionne correctement',
    timestamp: new Date().toISOString()
  });
});

// Routes de l'API
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/users'));
app.use('/api/teams', require('./routes/teams'));
app.use('/api/challenges', require('./routes/challenges'));
app.use('/api/scores', require('./routes/scores'));

// Route racine
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Bienvenue sur l\'API Podium',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      teams: '/api/teams',
      challenges: '/api/challenges',
      scores: '/api/scores'
    }
  });
});

// Middleware pour les routes non trouvées
app.use(notFound);

// Middleware de gestion des erreurs (doit être en dernier)
app.use(errorHandler);

// Démarrage du serveur
const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║      🏆  SERVEUR PODIUM DÉMARRÉ AVEC SUCCÈS  🏆      ║
║                                                       ║
║      Environnement: ${process.env.NODE_ENV || 'development'}                    ║
║      Port: ${PORT}                                     ║
║      URL: http://localhost:${PORT}                    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);
});

// Gestion propre de l'arrêt du serveur
process.on('unhandledRejection', (err) => {
  console.log('❌ UNHANDLED REJECTION! Arrêt du serveur...');
  console.error(err);
  server.close(() => {
    process.exit(1);
  });
});

process.on('SIGTERM', () => {
  console.log('👋 SIGTERM reçu. Arrêt propre du serveur...');
  server.close(() => {
    console.log('✅ Serveur arrêté');
    process.exit(0);
  });
});

module.exports = app;