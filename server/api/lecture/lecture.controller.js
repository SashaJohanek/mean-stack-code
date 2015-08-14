'use strict';

var _ = require('lodash');
var Lecture = require('./lecture.model'),
    Topic = require('./../topic/topic.model');

var pub = {
  index: function(req, res) {

    // Mogoose sort
    // http://stackoverflow.com/questions/5825520/in-mongoose-how-do-i-sort-by-date-node-js
    Lecture.find({
        createdBy: req.params.createdBy
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
      .populate('topic')
      .populate('media')
      .exec(function(err, lectures) {
        if (err) {
          return handleError(res, err);
        }

        return res.json(200, {
          result: lectures
        });
      });
  },

  indexByTopic: function(req, res) {

    Lecture.find({
        topic: req.params.topic
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
      .populate('topic')
      .exec(function(err, lectures) {
        // before we return the response, we need to populate the reference
        // for `grade` that nested under the `course` field.
        var options = {
          path: 'topic.course',
          model: 'Course'
        };

        Topic.populate(lectures, options,
          function(err, lectures) {
            if (err) {
              return handleError(res, err);
            }

            return res.json(200, {
              result: lectures
            });
          });        
      });

  }
};

// Get list of topics
exports.public = pub;

// Get list of records by topic
exports.indexByTopic = function(req, res) {
  Lecture.getByTopic(req.params.id, function(err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get list of lectures
exports.index = function(req, res) {
  Lecture.find({
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
    .populate('topic')
    .populate('media')
    .exec(function(err, lectures) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: lectures
      });
    });
};

// Get a single lecture
exports.show = function(req, res) {
  Lecture
    .findById(req.params.id)
    .populate('createdBy topic', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, page) {
      if (err) {
        return handleError(res, err);
      }
      if (!page) {
        return res.send(404);
      }

      return res.json(200, {
        result: page
      });
    });
};

// Creates a new lecture in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id,
      title: req.body.title,
      body: req.body.body,
      youtubeLink: req.body.youtubeLink,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      media: req.body.media,
      topic: req.body.topicId
    };

    Lecture.create(data, function(err, lecture) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        result: lecture
      });
    });

  }
};

// Updates an existing lecture in the DB.
exports.update = function(req, res) {
  if (req.query.deleteImage) {
    Lecture.findByIdAndUpdate(req.body._id, {
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
      createdBy: req.user._id,
      title: req.body.title,
      body: req.body.body,
      youtubeLink: req.body.youtubeLink,
      modifiedAt: Date.now(),
      media: req.body.media,
      topic: req.body.topicId,
      weight: req.body.weight
    };

    Lecture.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        return res.json(500);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/lectures/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a lecture from the DB.
exports.destroy = function(req, res) {
  Lecture.findById(req.params.id, function(err, lecture) {
    if (err) {
      return handleError(res, err);
    }
    if (!lecture) {
      return res.send(404);
    }
    lecture.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
