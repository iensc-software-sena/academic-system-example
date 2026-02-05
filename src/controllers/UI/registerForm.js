// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const registerForm = async (req, res, next) => {
  try {
    res.clearCookie('authentication').render('registerForm');
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de formulario de registro de usuario',
      err);
    next(boomError);
  }
};
