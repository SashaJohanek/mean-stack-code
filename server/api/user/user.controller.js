'use strict';

var User = require('./user.model');
var passport = require('passport');
var config = require('../../config/environment');
var jwt = require('jsonwebtoken');

var validationError = function(res, err) {
  return res.json(422, err);
};

/**
 * Get list of users
 * restriction: 'admin'
 */
exports.index = function(req, res) {
  User.find({}, '-salt -hashedPassword', function(err, users) {
    if (err) return res.send(500, err);
    res.json(200, users);
  });
};

/**
 * Creates a new user
 */
exports.create = function(req, res, next) {
  var newUser = new User(req.body);
  newUser.provider = 'local';
  newUser.role = 'user';
  newUser.save(function(err, user) {
    if (err) return validationError(res, err);
    var token = jwt.sign({
      _id: user._id
    }, config.secrets.session, {
      expiresInMinutes: 60 * 5
    });
    res.json({
      token: token,
      _id: user._id
    });
  });
};

/**
 * Get a single user
 */
exports.show = function(req, res, next) {
  var userId = req.params.id;
  console.log("user show()");

  User.findById(userId, function(err, user) {
    if (err) return next(err);
    if (!user) return res.send(401);
    console.log(user.profile);
    res.json(user.profile);
  });
};

/**
 * Deletes a user
 * restriction: 'admin'
 */
exports.destroy = function(req, res) {
  User.findByIdAndRemove(req.params.id, function(err, user) {
    if (err) return res.send(500, err);
    return res.send(204);
  });
};

/**
 * Change a users password
 */
exports.changePassword = function(req, res, next) {
  var userId = req.user._id;
  var oldPass = String(req.body.oldPassword);
  var newPass = String(req.body.newPassword);

  User.findById(userId, function(err, user) {
    if (user.authenticate(oldPass)) {
      user.password = newPass;
      user.save(function(err) {
        if (err) return validationError(res, err);
        res.send(200);
      });
    } else {
      res.send(403);
    }
  });
};


/**
 * Activate a user
 */
exports.feature = function(req, res, next) {
  var userId   = req.params.id;
  var featured = req.body.featured || false;
  console.log("Set as featured the user with id:", userId);
  console.log("Parameters sent: ", req.body);

  User.findById(userId, function(err, user) {
    if (err) return res.send(403);
    user.featured = featured;
    user.save(function(err) {
      if (err) return res.send(403);
      res.send(200);
    });
  });
}

/**
 * Activate a user
 */
exports.expire = function(req, res, next) {
  var userId  = req.params.id;
  var expiration = req.body.expiration || Date.now();
  console.log("Should set the expiration of the user with id:", userId);
  console.log("Parameters sent: ", req.body);

  User.findById(userId, function(err, user) {
    if (err) return res.send(403);
    user.expiration = expiration;
    user.save(function(err) {
      if (err) return res.send(403);
      res.send(200);
    });
  });
}

// Updates an existing account in the DB.
exports.update = function(req, res) {

  var id = req.body._id;

  var data = {
    name: req.body.name,
    featured: req.body.featured,
    expiration: new Date(req.body.expiration).getTime()
  }

  console.log(data);

  User.findOneAndUpdate({
    _id: id
  }, data, function(err, doc) {
    if (err) {
      console.log('500:' + err);
      return res.json(500);
    } else {
      console.log('200:' + doc);
      return res.json(200, {
        result: doc
      });
    }
  });
};


/**
 * Get my info
 */
exports.me = function(req, res, next) {
  console.log("user me()");

  var userId = req.user._id;
  User.findOne({
    _id: userId
  }, '-salt -hashedPassword', function(err, user) { // don't ever give out the password or salt
    if (err) return next(err);
    if (!user) return res.json(401);
    res.json(user);
  });
};

/**
 * Authentication callback
 */
exports.authCallback = function(req, res, next) {
  res.redirect('/');
};
