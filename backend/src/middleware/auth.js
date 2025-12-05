const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.warn('⚠️ Tentative d\'accès sans token:', req.method, req.path);
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé. Token manquant.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token
    const decoded = verifyToken(token);
    console.log(`🔐 Token vérifié pour l'utilisateur: ${decoded.userId}`);
    
    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      console.warn(`⚠️ Utilisateur non trouvé: ${decoded.userId}`);
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé.' 
      });
    }

    if (user.status === 'blocked') {
      console.warn(`⚠️ Compte bloqué tentant d'accéder: ${user.email}`);
      return res.status(403).json({ 
        success: false, 
        message: 'Compte bloqué. Contactez un administrateur.' 
      });
    }

    console.log(`✅ Authentification réussie: ${user.email} (${user.role})`);
    
    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    console.error('❌ Erreur d\'authentification:', error.message);
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré.' 
    });
  }
};

module.exports = { authenticate };