'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Grade = require('./grade.model');

var pub = {
  index: function(req, res) {
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Grade.find({
        createdBy: req.params.createdBy
      })
      .sort({
        weight: 1,
        createdAt: 1
      })
      .populate({
        path: 'createdBy',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('media')
      .exec(function(err, grades) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: grades
        });
      });
  }
};

// Get list of grades
exports.public = pub;

// Get list of grades
exports.index = function(req, res) {
  // Mogoose sort
  // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
  Grade.find({
      createdBy: req.user._id
    })
    .sort({
      weight: 1,
      createdAt: 1
    })
    .populate({
      path: 'createdBy',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, grades) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: grades
      });
    });
};

// Get a single grade
exports.show = function(req, res) {
  Grade
    .findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, grade) {
      if (err) {
        return handleError(res, err);
      }
      if (!grade) {
        return res.send(404);
      }

      return res.json(200, {
        result: grade
      });

    });
};

// Creates a new grade in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var gradeData = {
      createdBy: req.user._id,
      name: req.body.name,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Grade.create(gradeData, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:9000/api/grades/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    });
  }
};

// Updates an existing grade in the DB.
exports.update = function(req, res) {

  if (req.query.deleteImage) {
    Grade.findByIdAndUpdate(req.body._id, {
      $pop: {
        media: -1
      }
    }, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }
    });
  }

  if (req.body && req.params.id) {

    var data = {
      name: req.body.name,
      weight: req.body.weight,
      media: req.body.media,
      modifiedAt: Date.now()
    };

    Grade.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        // return res.json(500);
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/grades/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a grade from the DB.
exports.destroy = function(req, res) {
  Grade.findById(req.params.id, function(err, grade) {
    if (err) {
      return handleError(res, err);
    }
    if (!grade) {
      return res.send(404);
    }
    grade.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
