'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var CategorySchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  creatorId: String,
  // category name
  name: String,
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field to set the prefered order of the categories
  weight: {
    type: Number,
    default: 0
  },
  // we use this field when the first time category created
  createdAt: Number,
  // we use this field when the category is updated
  modifiedAt: Number
});

CategorySchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Category', CategorySchema);