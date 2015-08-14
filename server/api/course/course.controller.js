'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Course = require('./course.model');

var pub = {
  index: function(req, res) {
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Course.find({
        createdBy: req.params.createdBy
      })
      .sort({
        weight: 1,
        createdAt: 1
      })
      .populate({
        path: 'createdBy grade',
        select: ' -email -role -hashedPassword -salt -provider -__v',
        options: {
          weight: 1
        }
      })
      .populate('media')
      .exec(function(err, courses) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: courses
        });
      });
  },

  indexByGrade: function(req, res) {

    Course.find({
      grade: req.params.grade
    })
    .populate({
      path: 'createdBy grade',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, items) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: items
      });
    });
  }
};

// Get list of courses
exports.public = pub;

// Get list of records by grade
exports.indexByGrade = function(req, res) {

  Course.getByGrade(req.params.id, function(err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get list of courses
exports.index = function(req, res) {
  // Mogoose sort
  // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
  Course.find({
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
    .exec(function(err, courses) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: courses
      });
    });
};

// Get a single course
exports.show = function(req, res) {
  Course
    .findById(req.params.id)
    .populate('createdBy grade', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, course) {
      if (err) {
        return handleError(res, err);
      }
      if (!course) {
        return res.send(404);
      }

      return res.json(200, {
        result: course
      });

    });
};

// Creates a new course in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var courseData = {
      createdBy: req.user._id,
      grade: req.body.gradeId,
      name: req.body.name,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Course.create(courseData, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:9000/api/courses/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    });
  }
};

// Updates an existing course in the DB.
exports.update = function(req, res) {

  if (req.query.deleteImage) {
    Course.findByIdAndUpdate(req.body._id, {
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
      grade: req.body.gradeId,
      weight: req.body.weight,
      media: req.body.media,
      modifiedAt: Date.now()
    };

    Course.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        // return res.json(500);
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/courses/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a course from the DB.
exports.destroy = function(req, res) {
  Course.findById(req.params.id, function(err, course) {
    if (err) {
      return handleError(res, err);
    }
    if (!course) {
      return res.send(404);
    }
    course.remove(function(err) {
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
