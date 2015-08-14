'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  Schema = mongoose.Schema;

var ItemSchema = new Schema({
  createdBy: {
    type: String,
    ref: 'User'
  },
  // reference to category
  category: {
    type: String,
    ref: 'Category'
  },
  // item name
  name:         String,
  // introduction short text
  intro:        { type: String, default: '' },
  // description long text
  description:  { type: String, default: '' },
  // prices
  prices: [{
    name:       String,
    value:      Number
  }],
  preparation:  { type: Number, default: 0 },
  tax:          { type: Number, default: 0 },
  // list of media associated with this document
  media: [{
    type: String,
    ref: 'Media'
  }],
  // introduction short text
  link:         { type: String, default: '' },
  // we use this field to set the prefered order of the categories
  weight:       { type: Number, default: 0 },
  // we use this field when the first time news created
  createdAt:    Number,
  // we use this field when the news is updated
  modifiedAt:   Number
});

ItemSchema.plugin(mUtilities.pagination);

/**
 * Get the items by category. The current Item schema only hold the categoryId,
 * so we need to fetch the category details first before we populate the
 * response
 * @param {String} catId category identifier
 * @param {Function} cb callback function
 */
ItemSchema.statics.getByCategory = function(catId, cb) {
  this.find({
    category: catId
  },null, {sort:{ weight: 1}}, cb);
};

module.exports = mongoose.model('Item', ItemSchema);
