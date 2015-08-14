'use strict';

var _ = require('lodash'),
  Article = require('./article.model'),
  mongoose = require('mongoose'),
  config = require('./../../config/environment');

/**
 * Get list of records
 */
function getListOfArticle(req, res) {
  Article.paginate({
    query: {
      createdBy: req.user._id
    },
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 5,
    sort: {
      modifiedAt: -1
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
}

/**
 * Get single record
 */
function getSingleArticle(req, res) {
  Article
    .findOne({
      _id: mongoose.Types.ObjectId(req.params.id),
      createdBy: req.user._id.toString()
    })
    .populate('createdBy', '-hashedPassword -salt -provider -__v')
    .populate('media')
    .exec(function(err, doc) {
      if (err) {
        return handleError(res, err);
      }

      if (doc) {
        return res.json(200, {
          url: 'http://localhost/api/article/' + doc._id,
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
}

/**
 * Get list of records
 */
exports.index = function(req, res) {
  getListOfArticle(req, res);
};

/**
 * Get a single record
 */
exports.show = function(req, res) {
  getSingleArticle(req, res);
};

// Creates a record in the DB.
exports.create = function(req, res) {
  if (req.body) {
    var data = {
      createdBy: req.user._id.toString(),
      title: req.body.title,
      tags: req.body.tags.split(','),
      body: req.body.body,
      media: req.body.media,
      createdAt: Date.now(),
      modifiedAt: Date.now()
    };

    Article.create(data, function(err, doc) {
      if (err) return res.json(500, err);

      return res.json(201, {
        result: doc
      });
    });
  }
};

/**
 * Update record
 */
exports.update = function(req, res) {

  var data = {
    title: req.body.title,
    tags: req.body.tags.split(','),
    body: req.body.body,
    media: req.body.media,
    modifiedAt: Date.now()
  };

  Article
    .findOneAndUpdate({
      _id: req.params.id
    }, data)
    // .populate('createdBy', '-hashedPassword -salt -provider -__v')
    // .populate('media')
    .exec(function(err, doc) {
      if (err) {
        return handleError(res, err);
      } else {
        return res.json(200, {
          result: doc
        });
      }
    });

};

/**
 * Delete record
 */
exports.destroy = function(req, res) {
  Article.findById(req.params.id, function(err, article) {
    if (err) {
      return handleError(res, err);
    }
    if (!article) {
      return res.send(404);
    }
    article.remove(function(err) {
      if (err) {
        return handleError(res, err);
      }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
