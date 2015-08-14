'use strict';

var _ = require('lodash'),
  Item = require('./item.model');


var pub = {
  index: function(req, res) {

    Item.find({
      createdBy: req.params.createdBy
    })
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, items) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: items
      });
    })
  },

  indexByCategory: function(req, res) {

    Item.find({
      category: req.params.category
    })
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, items) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(200, {
        result: items
      });
    });
  }

}

// Get list of items
exports.public = pub;

// Get list of items
exports.index = function(req, res) {

  Item.find({
    createdBy: req.user._id,
  })
  .populate({
    path: 'createdBy category',
    select: '-hashedPassword -salt -provider -__v',
    options: {
      weight: 1
    }
  })
  .populate('media')
  .exec(function(err, items) {
    if (err) {
      return handleError(res, err);
    }

    return res.json(200, {
      result: items
    });
  });
};

// Get list of items by category
exports.indexByCategory = function(req, res) {

  Item.getByCategory(req.params.id, function(err, docs) {
    return res.json(200, {
      result: docs
    });
  });
};

// Get a single item
exports.show = function(req, res) {
  Item
    .findById(req.params.id)
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('media')
    .exec(function(err, item) {
      if (err) {
        return handleError(res, err);
      }
      if (!item) {
        return res.send(404);
      }

      return res.json(200, {
        result: item
      });
    });
};

// Creates a new item in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id,
      category: req.body.categoryId,
      name: req.body.name,
      intro: req.body.intro,
      description: req.body.description,
      weight: req.body.weight,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now(),
      prices: req.body.prices,
      tax: req.body.tax,
      link: req.body.link,
      preparation: req.body.preparation
    };

    Item.create(data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      return res.json(201, {
        url: 'http://localhost:9000/api/categories/' + doc._id,
        jsonrpc: '2.0',
        result: doc
      });
    });
  }
};

// Updates an existing item in the DB.
exports.update = function(req, res) {

  if (req.query.deleteImage) {
    Item.findByIdAndUpdate(req.body._id, {
      $pop: {
        media: -1
      }
    }, function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      // var upload = require('./../upload/upload.controller');
      // upload.deleter(req.body.media[0], function(err, result) {
      //   if (err) {
      //     return handleError(res, err);
      //   }
      //
      //   return res.send(204);
      // });
    });
  }

  if (req.body && req.params.id) {
    var data = {
      // categoryId: req.body.categoryId,
      category: req.body.category,
      name: req.body.name,
      intro: req.body.intro,
      description: req.body.description,
      weight: req.body.weight,
      media: req.body.media,
      modifiedAt: Date.now(),
      prices: req.body.prices,
      tax: req.body.tax,
      link: req.body.link,
      preparation: req.body.preparation
    };

    Item.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/items/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a item from the DB.
exports.destroy = function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (err) {
      return handleError(res, err);
    }
    if (!item) {
      return res.send(404);
    }
    item.remove(function(err) {
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
