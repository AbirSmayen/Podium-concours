require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const connectDB = require('./config/database');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { verifyToken } = require('./config/jwt');
const User = require('./models/User');

// Initialisation de l'application
const app = express();
const server = http.createServer(app);

// Configuration Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001',
      process.env.USERS_FRONTEND_URL || 'http://localhost:3000'
    ],
    credentials: true,
    methods: ['GET', 'POST']
  }
});

// Middleware d'authentification Socket.IO
io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) {
      return next(new Error('Token manquant'));
    }
    const decoded = verifyToken(token);
    const user = await User.findById(decoded.userId);
    if (!user) {
      return next(new Error('Utilisateur non trouvé'));
    }
    socket.userId = user._id.toString();
    socket.userRole = user.role;
    next();
  } catch (error) {
    next(new Error('Token invalide'));
  }
});

// Gestion des connexions Socket.IO
io.on('connection', (socket) => {
  console.log(`✅ Client connecté: ${socket.userId} (${socket.userRole})`);

  // Rejoindre la salle globale pour les mises à jour du classement
  socket.join('leaderboard');

  // Rejoindre la salle de l'équipe si l'utilisateur a une équipe
  socket.on('join-team', async (teamId) => {
    socket.join(`team:${teamId}`);
    console.log(`👥 ${socket.userId} a rejoint l'équipe ${teamId}`);
  });

  socket.on('leave-team', (teamId) => {
    socket.leave(`team:${teamId}`);
    console.log(`👋 ${socket.userId} a quitté l'équipe ${teamId}`);
  });

  socket.on('disconnect', () => {
    console.log(`❌ Client déconnecté: ${socket.userId}`);
  });
});

// Exporter io pour utilisation dans les contrôleurs
app.set('io', io);

// Connexion à la base de données
connectDB();

// Middlewares globaux
app.use(helmet()); // Sécurité des headers HTTP
app.use(cors({
  origin: [
    process.env.ADMIN_FRONTEND_URL || 'http://localhost:3001',
    process.env.USERS_FRONTEND_URL || 'http://localhost:3000'
  ],
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
app.use('/api/requests', require('./routes/requests'));
app.use('/api/motivations', require('./routes/motivations'));

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

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║      🏆  SERVEUR PODIUM DÉMARRÉ AVEC SUCCÈS  🏆      ║
║                                                       ║
║      Environnement: ${process.env.NODE_ENV || 'development'}                    ║
║      Port: ${PORT}                                     ║
║      URL: http://localhost:${PORT}                    ║
║      WebSocket: Activé                                ║
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

module.exports = { app, server, io };