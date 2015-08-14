'use strict';

var _ = require('lodash'),
  mongoose = require('mongoose'),
  Offer = require('./offer.model'),
  Item  = require('./../item/item.model');

var pub = {
  index: function(req, res) {

    Offer.find({
      createdBy: req.params.createdBy
    })
    .populate({
      path: 'createdBy category',
      select: '-hashedPassword -salt -provider -__v',
      options: {
        weight: 1
      }
    })
    .populate('item')
    .populate('media')
    .exec(function(err, items) {
      if (err) {
        return handleError(res, err);
      }

      Item.populate(items, {
        path: 'item.category',
        model: 'Category'
      },
      function(err,items){
        if(err) handleError(err);

        console.log('Populated ' + items);

        return res.json(200, {
          result: items
        });

      });

      // return res.json(200, {
      //   result: items
      // });
    })
  }
}

// Get list of offers
exports.public = pub;

// Get list of offers
exports.index = function(req, res) {

  Offer.paginate({
    query: {
      createdBy: req.user._id
    },
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 5,
    sort: {
      // modifiedAt: -1
      active: -1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    res.json(200, {
      jsonrpc: '2.0',
      page: provider.page,
      page_size: 5,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });
};

// Get a single offer
exports.show = function(req, res) {
  Offer.findById(req.params.id)
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('item', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, doc) {

      if (err) {
        return handleError(res, err);
      }

      if (doc) {
        return res.json(200, {
          url: 'http://localhost/api/offers/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }

      if (doc == null) {
        return res.send(404, {
          message: 'The document you are looking for is not exist'
        });
      }
    });
};

// Creates a new offer in the DB.
exports.create = function(req, res) {

  var data = {
    createdBy: req.user._id,
    name: req.body.name,
    intro: req.body.intro,
    description: req.body.description,
    active: req.body.active,
    //itemId: req.body.itemId,
    item: req.body.item,
    prices: req.body.prices,
    media: req.body.media,
    createdAt: Date.now(),
    modifiedAt: Date.now()
  }

  Offer.create(data, function(err, offer) {
    if (err) {
      return handleError(res, err);
    }
    return res.json(201, offer);
  });
};

// Updates an existing offer in the DB.
exports.update = function(req, res) {

  if (req.query.deleteImage) {
    Offer.findByIdAndUpdate(req.body._id, {
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
      name: req.body.name,
      intro: req.body.intro,
      description: req.body.description,
      active: req.body.active,
      //itemId: req.body.itemId,
      item: req.body.item,
      prices: req.body.prices,
      media: req.body.media,
      modifiedAt: Date.now()
    }

    Offer.findOneAndUpdate({
      _id: req.params.id
    }, data, function(err, doc) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, {
          url: 'http://localhost/api/offers/' + doc._id,
          jsonrpc: '2.0',
          result: doc
        });
      }
    });
  }
};

// Deletes a offer from the DB.
exports.destroy = function(req, res) {
  Offer.findById(req.params.id, function(err, offer) {
    if (err) {
      return handleError(res, err);
    }
    if (!offer) {
      return res.send(404);
    }
    offer.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

exports.active = function(req, res) {
  Offer.count({
    active: true
  }, function(err, count) {
    if (err) {
      return handleError(res, err);
    } else {
      console.log('there are %d active offers', count);
      return res.json(200, {
        result: count
      });
    }
  });
}

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
