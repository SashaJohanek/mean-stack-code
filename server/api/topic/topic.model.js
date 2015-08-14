'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var TopicSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  // reference to Course
  course: {
    type: String,
    ref: 'Course'
  },
  creatorId: String,
  // topic name
  name: String,
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field to set the prefered order of the topics
  weight: {
    type: Number,
    default: 0
  },
  // we use this field when the first time topic created
  createdAt: Number,
  // we use this field when the topic is updated
  modifiedAt: Number
});

TopicSchema.plugin(mUtilities.pagination);

/**
 * Get the topics by course. The current Topic schema only hold the courseId,
 * so we need to fetch the course details first before we populate the
 * response
 * @param {String} courseId course dentifier
 * @param {Function} cb callback function
 */
TopicSchema.statics.getByCourse = function(courseId, cb) {
  this.find({
    course: courseId
  }, null, {
    sort: {
      weight: 1
    }
  }, cb);
};

module.exports = mongoose.model('Topic', TopicSchema);
