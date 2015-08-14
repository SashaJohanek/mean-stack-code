'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var CourseSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  // reference to grade
  grade: {
    type: String,
    ref: 'Grade'
  },
  creatorId: String,
  // course name
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

CourseSchema.plugin(mUtilities.pagination);


/**
 * Get the courses by grade. The current Course schema only hold the gradeId,
 * so we need to fetch the grade details first before we populate the
 * response
 * @param {String} gradeId grade dentifier
 * @param {Function} cb callback function
 */
CourseSchema.statics.getByGrade = function(gradeId, cb) {
  this.find({
    grade: gradeId
  }, null, {
    sort: {
      weight: 1
    }
  }, cb);
};

module.exports = mongoose.model('Course', CourseSchema);
