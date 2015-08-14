'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Topic = require('./topic.model'),
  Course = require('./../course/course.model');

var pub = {
  index: function(req, res) {
    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Topic.find({
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
      .populate('course')
      .exec(function(err, topics) {
        // before we return the response, we need to populate the reference
        // for `grade` that nested under the `course` field.
        var options = {
          path: 'course.grade',
          model: 'Grade'
        };

        Course.populate(topics, options,
          function(err, topics) {
            if (err) {
              return handleError(res, err);
            }

            return res.json(200, {
              result: topics
            });
          });
      });
  },

  indexByCourse: function(req, res) {

    Topic.find({
        course: req.params.course
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
      .populate('course')
      .exec(function(err, topics) {
        // before we return the response, we need to populate the reference
        // for `grade` that nested under the `course` field.
        var options = {
          path: 'course.grade',
          model: 'Grade'
        };

        Course.populate(topics, options,
          function(err, topics) {
            if (err) {
              return handleError(res, err);
            }

            return res.json(200, {
              result: topics
            });
          });
      });

  }
};

// Get list of topics
exports.public = pub;

// Get list of records by course
exports.indexByCourse = function(req, res) {
  Topic.getByCourse(req.params.id, function(err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get list of topics
exports.index = function(req, res) {
  // Mogoose sort
  // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
  Topic.find({
      createdBy: req.user._id.toString()
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
    .populate('course')
    .exec(function(err, topics) {
      // before we return the response, we need to populate the reference
      // for `grade` that nested under the `course` field.
      var options = {
        path: 'course.grade',
        model: 'Grade'
      };

      Course.populate(topics, options,
        function(err, topics) {
          if (err) {
            return handleError(res, err);
          }

          return res.json(200, {
            result: topics
          });
        });
    });
};

// Get a single topic
exports.show = function(req, res) {
  Topic
    .findById(req.params.id)
    .populate('createdBy course', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, topic) {
      if (err) {
        return handleError(res, err);
      }
      if (!topic) {
        return res.send(404);
      }

      return res.json(200, {
        result: topic
      });

    });
};

// Creates a new topic in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var topicData = {
      createdBy: req.user._id,
      course: req.body.courseId,
      name: req.body.name,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Topic.create(topicData, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:9000/api/topics/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    });
  }
};

// Updates an existing topic in the DB.
exports.update = function(req, res) {

  if (req.query.deleteImage) {
    Topic.findByIdAndUpdate(req.body._id, {
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
      course: req.body.courseId,
      weight: req.body.weight,
      media: req.body.media,
      modifiedAt: Date.now()
    };

    Topic.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/topics/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a topic from the DB.
exports.destroy = function(req, res) {
  Topic.findById(req.params.id, function(err, topic) {
    if (err) {
      return handleError(res, err);
    }
    if (!topic) {
      return res.send(404);
    }
    topic.remove(function(err) {
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
