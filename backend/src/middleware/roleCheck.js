// Middleware pour vérifier les rôles d'utilisateur
const checkRole = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Utilisateur non authentifié.' 
      });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Accès refusé. Rôle requis: ${allowedRoles.join(' ou ')}.` 
      });
    }

    next();
  };
};

// Middleware pour vérifier si l'utilisateur est admin
const isAdmin = checkRole('admin');

// Middleware pour vérifier si l'utilisateur est leader ou admin
const isLeaderOrAdmin = checkRole('leader', 'admin');

// Middleware pour vérifier si l'utilisateur est actif
const isActive = (req, res, next) => {
  if (req.user.status !== 'active') {
    return res.status(403).json({ 
      success: false, 
      message: 'Votre compte n\'est pas encore activé.' 
    });
  }
  next();
};

module.exports = { 
  checkRole, 
  isAdmin, 
  isLeaderOrAdmin, 
  isActive 
};