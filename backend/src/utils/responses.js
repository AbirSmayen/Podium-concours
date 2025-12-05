// Réponses standardisées pour l'API

const successResponse = (res, data, message = 'Succès', statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
};

const errorResponse = (res, message = 'Erreur', statusCode = 500, errors = null) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors && { errors })
  });
};

const createdResponse = (res, data, message = 'Créé avec succès') => {
  return successResponse(res, data, message, 201);
};

const notFoundResponse = (res, message = 'Ressource non trouvée') => {
  return errorResponse(res, message, 404);
};

const unauthorizedResponse = (res, message = 'Non autorisé') => {
  return errorResponse(res, message, 401);
};

const forbiddenResponse = (res, message = 'Accès refusé') => {
  return errorResponse(res, message, 403);
};

const badRequestResponse = (res, message = 'Requête invalide', errors = null) => {
  return errorResponse(res, message, 400, errors);
};

module.exports = {
  successResponse,
  errorResponse,
  createdResponse,
  notFoundResponse,
  unauthorizedResponse,
  forbiddenResponse,
  badRequestResponse
};