// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const loginForm = async (req, res, next) => {
  try {
    res.clearCookie('authentication').render('loginForm');
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de formulario de inicio de sección',
      err);
    next(boomError);
  }
};
