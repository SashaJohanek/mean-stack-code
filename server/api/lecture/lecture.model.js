'use strict';

var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

var LectureSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  // reference to Topic
  topic: {
    type: String,
    ref: 'Topic'
  },
  title: String,
  body: {
    type: String,
    default: ''
  },
  youtubeLink: {
    type: String,
    default: ''
  },
  // we use this field to set the prefered order of the topics
  weight: {
    type: Number,
    default: 0
  },
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field when the first time record created
  createdAt: Number,
  // we use this field when the record is updated
  modifiedAt: Number
});

/**
 * Get the lectures by topic. The current Lecture schema only hold the topicId,
 * so we need to fetch the topic details first before we populate the response
 * @param {String} topicId course dentifier
 * @param {Function} cb callback function
 */
LectureSchema.statics.getByTopic = function(topicId, cb) {
  this.find({
    topic: topicId
  }, null, {
    sort: {
      weight: 1
    }
  }, cb);
};

module.exports = mongoose.model('Lecture', LectureSchema);
