'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var schemaOptions = {
  collection: 'quizzes'
};

var QuizSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  title: String,
  body: String,
  questions: [{
    question: String,
    answers: [{
      answer: String,
      isCorrect: {
        type: Boolean,
        default: false
      }
    }]
  }],
  // we use this field when the first time record created
  createdAt: Number,
  // we use this field when the record is updated
  modifiedAt: Number
}, schemaOptions);

QuizSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Quiz', QuizSchema);
