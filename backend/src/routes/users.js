const express = require('express');
const routerUsers = express.Router();
const {
  getAllUsers,
  getUserById,
  getLeaderRequests,
  updateLeaderStatus,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getUserStats
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');
const { isAdmin } = require('../middleware/roleCheck');
const { idValidation } = require('../utils/validators');

// Toutes les routes nécessitent admin
routerUsers.use(authenticate);
routerUsers.use(isAdmin);

// Routes statistiques
routerUsers.get('/stats', getUserStats);

// Routes demandes leader
routerUsers.get('/leader-requests', getLeaderRequests);

// Routes CRUD
routerUsers.get('/', getAllUsers);
routerUsers.get('/:id', idValidation, getUserById);
routerUsers.put('/:id/leader-status', idValidation, updateLeaderStatus);
routerUsers.put('/:id/role', idValidation, updateUserRole);
routerUsers.put('/:id/status', idValidation, updateUserStatus);
routerUsers.delete('/:id', idValidation, deleteUser);

module.exports = routerUsers;