'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var OfferSchema = new Schema({
  // reference the user account of the creator
  createdBy: {
    type: String,
    ref: 'User'
  },
  // reference the item
  item: {
    type: String,
    ref: 'Item'
  },
  // offer name
  name: String,
  // introduction short text
  intro: {
    type: String,
    default: ''
  },
  // description long text
  description: {
    type: String,
    default: ''
  },
  active: Boolean,
  // prices
  prices: [{
    name: String,
    value: Number
  }],
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // we use this field when the first time document is created
  createdAt: Number,
  // we use this field when the document is updated
  modifiedAt: Number
});

OfferSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Offer', OfferSchema);