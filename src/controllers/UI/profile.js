// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const profile = async (req, res, next) => {
  try {
    res.render('profile');
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de perfil de usuario.',
      err);
    next(boomError);
  }
};
