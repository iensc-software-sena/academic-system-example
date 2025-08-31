// Import Boom for handling HTTP-friendly error objects
import Boom from '@hapi/boom';

export const dashboard = async (req, res, next) => {
  try {
    res.render('dashboard');
  } catch (err) {
    const boomError = Boom.notImplemented(
      'No es posible renderizar la vista de dashboard principal.',
      err);
    next(boomError);
  }
};
