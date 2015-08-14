'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var GradeSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  creatorId: String,
  // grade name
  name: String,
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field to set the prefered order of the grades
  weight: {
    type: Number,
    default: 0
  },
  // we use this field when the first time grade created
  createdAt: Number,
  // we use this field when the grade is updated
  modifiedAt: Number
});

GradeSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Grade', GradeSchema);
