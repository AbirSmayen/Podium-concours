const { verifyToken } = require('../config/jwt');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  try {
    // Récupérer le token depuis le header Authorization
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        success: false, 
        message: 'Accès non autorisé. Token manquant.' 
      });
    }

    const token = authHeader.split(' ')[1];
    
    // Vérifier et décoder le token
    const decoded = verifyToken(token);
    
    // Trouver l'utilisateur
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non trouvé.' 
      });
    }

    if (user.status === 'blocked') {
      return res.status(403).json({ 
        success: false, 
        message: 'Compte bloqué. Contactez un administrateur.' 
      });
    }

    // Attacher l'utilisateur à la requête
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({ 
      success: false, 
      message: 'Token invalide ou expiré.' 
    });
  }
};

module.exports = { authenticate };