const getUsersModule = () => {
  const User = require('../models/User');
  const { successResponse, errorResponse, notFoundResponse, badRequestResponse } = require('../utils/responses');

  // @desc    Récupérer tous les utilisateurs (Admin)
  // @route   GET /api/users
  // @access  Private/Admin
  const getAllUsers = async (req, res, next) => {
    try {
      const { status, role, search } = req.query;

      // Construire la requête
      let query = {};

      if (status) query.status = status;
      if (role) query.role = role;
      if (search) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } }
        ];
      }

      const users = await User.find(query)
        .populate('teamId', 'name logo')
        .sort({ createdAt: -1 });

      successResponse(res, { 
        users,
        total: users.length 
      }, 'Utilisateurs récupérés');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Récupérer un utilisateur par ID
  // @route   GET /api/users/:id
  // @access  Private/Admin
  const getUserById = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id).populate('teamId', 'name logo score');

      if (!user) {
        return notFoundResponse(res, 'Utilisateur non trouvé');
      }

      successResponse(res, { user }, 'Utilisateur récupéré');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Récupérer les demandes de leader en attente (Admin)
  // @route   GET /api/users/leader-requests
  // @access  Private/Admin
  const getLeaderRequests = async (req, res, next) => {
    try {
      const requests = await User.find({ 
        role: 'leader', 
        status: 'pending' 
      }).sort({ createdAt: -1 });

      successResponse(res, { 
        requests,
        total: requests.length 
      }, 'Demandes de leader récupérées');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Approuver/Rejeter une demande de leader (Admin)
  // @route   PUT /api/users/:id/leader-status
  // @access  Private/Admin
  const updateLeaderStatus = async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!['active', 'blocked'].includes(status)) {
        return badRequestResponse(res, 'Statut invalide. Utilisez "active" ou "blocked"');
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return notFoundResponse(res, 'Utilisateur non trouvé');
      }

      if (user.role !== 'leader') {
        return badRequestResponse(res, 'Cet utilisateur n\'est pas un leader');
      }

      user.status = status;
      await user.save();

      successResponse(res, { user }, 
        status === 'active' ? 'Demande de leader approuvée' : 'Demande de leader rejetée'
      );

    } catch (error) {
      next(error);
    }
  };

  // @desc    Mettre à jour le rôle d'un utilisateur (Admin)
  // @route   PUT /api/users/:id/role
  // @access  Private/Admin
  const updateUserRole = async (req, res, next) => {
    try {
      const { role } = req.body;

      if (!['admin', 'leader', 'member'].includes(role)) {
        return badRequestResponse(res, 'Rôle invalide');
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return notFoundResponse(res, 'Utilisateur non trouvé');
      }

      if (user._id.toString() === req.user._id.toString()) {
        return badRequestResponse(res, 'Vous ne pouvez pas modifier votre propre rôle');
      }

      user.role = role;
      
      if (role === 'leader' && user.status !== 'blocked') {
        user.status = 'pending';
      }

      await user.save();

      successResponse(res, { user }, 'Rôle mis à jour');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Bloquer/Débloquer un utilisateur (Admin)
  // @route   PUT /api/users/:id/status
  // @access  Private/Admin
  const updateUserStatus = async (req, res, next) => {
    try {
      const { status } = req.body;

      if (!['active', 'blocked', 'pending'].includes(status)) {
        return badRequestResponse(res, 'Statut invalide');
      }

      const user = await User.findById(req.params.id);

      if (!user) {
        return notFoundResponse(res, 'Utilisateur non trouvé');
      }

      if (user._id.toString() === req.user._id.toString()) {
        return badRequestResponse(res, 'Vous ne pouvez pas modifier votre propre statut');
      }

      user.status = status;
      await user.save();

      successResponse(res, { user }, 'Statut mis à jour');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Supprimer un utilisateur (Admin)
  // @route   DELETE /api/users/:id
  // @access  Private/Admin
  const deleteUser = async (req, res, next) => {
    try {
      const user = await User.findById(req.params.id);

      if (!user) {
        return notFoundResponse(res, 'Utilisateur non trouvé');
      }

      if (user._id.toString() === req.user._id.toString()) {
        return badRequestResponse(res, 'Vous ne pouvez pas supprimer votre propre compte');
      }

      if (user.teamId) {
        const Team = require('../models/Team');
        await Team.findByIdAndUpdate(
          user.teamId,
          { $pull: { members: user._id } }
        );
      }

      await user.deleteOne();

      successResponse(res, null, 'Utilisateur supprimé');

    } catch (error) {
      next(error);
    }
  };

  // @desc    Récupérer les statistiques des utilisateurs (Admin)
  // @route   GET /api/users/stats
  // @access  Private/Admin
  const getUserStats = async (req, res, next) => {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ status: 'active' });
      const pendingUsers = await User.countDocuments({ status: 'pending' });
      const blockedUsers = await User.countDocuments({ status: 'blocked' });
      
      const admins = await User.countDocuments({ role: 'admin' });
      const leaders = await User.countDocuments({ role: 'leader' });
      const members = await User.countDocuments({ role: 'member' });

      successResponse(res, {
        total: totalUsers,
        byStatus: {
          active: activeUsers,
          pending: pendingUsers,
          blocked: blockedUsers
        },
        byRole: {
          admins,
          leaders,
          members
        }
      }, 'Statistiques récupérées');

    } catch (error) {
      next(error);
    }
  };

  return {
    getAllUsers,
    getUserById,
    getLeaderRequests,
    updateLeaderStatus,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getUserStats
  };
};

module.exports = getUsersModule();