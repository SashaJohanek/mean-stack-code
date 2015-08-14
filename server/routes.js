/**
 * Main application routes
 */

'use strict';

var errors = require('./components/errors');

module.exports = function(app) {

  // Insert routes below
  app.use('/api/posters', require('./api/poster'));
  app.use('/api/lectures', require('./api/lecture'));
  app.use('/api/quizzes', require('./api/quiz'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/accounts', require('./api/account'));
  app.use('/api/pages', require('./api/page'));
  app.use('/api/orders', require('./api/order'));
  app.use('/api/offers', require('./api/offer'));
  app.use('/api/items', require('./api/item'));
  app.use('/api/categories', require('./api/category'));
  app.use('/api/grades', require('./api/grade'));
  app.use('/api/courses', require('./api/course'));
  app.use('/api/topics', require('./api/topic'));
  app.use('/api/articles', require('./api/article'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/uploads', require('./api/upload'));
  app.use('/api/media', require('./api/media'));
  app.use('/api/rooms', require('./api/room'));
  // Public API
  app.use('/public/business', require('./api/account'));

  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendfile(app.get('appPath') + '/index.html');
    });
};
