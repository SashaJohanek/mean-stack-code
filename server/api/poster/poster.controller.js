'use strict';

var _ = require('lodash');
var Poster = require('./poster.model');
var async = require('async');

// Get list of posters
exports.index = function(req, res) {
  if (req.query.page == null) {

    // all posters
    Poster.find({
      createdBy: req.user._id.toString()
    })
    .populate('room')
    .exec(function (err, posters) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
          result : posters
      });
    });

  }
  else {

    // page navigation

    Poster.paginate({
      query: {
        createdBy: req.user._id
      },
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 5
      }, function(err, provider) {
      if (err) {
        return handleError(res, err);
      }

      var _provider = provider;

      // Populate rooms
      Poster.populate(provider.docs, {
        path: 'room',
        model: 'Room'
      },
      function(err, posters){
        res.json(200, {
          page: _provider.page,
          page_size: 5,
          total: _provider.docs.length,
          num_pages: _provider.pages,
          result: _provider.docs
        });
      });

    });
  }
};

// Get a single poster
exports.show = function(req, res) {
  Poster.findOne({
    _id: req.params.id,
    createdBy: req.user._id.toString()
  }, function (err, poster) {
    if(err) { return handleError(res, err); }
    if(!poster) { return res.send(404); }
    return res.json(poster);
  });
};

// Creates a new poster in the DB.
exports.create = function(req, res) {
  var _dataArr = []
      ,_functionArr =[];

  if (req.body) {
    _dataArr.push(req.body);
    if(req.body instanceof Array) _dataArr = req.body;

    _dataArr.forEach(function(el){
      //create array functions for async request
      _functionArr.push(function(cb){
        var data = el;
        data.createdBy = req.user._id.toString();
        data.createdAt = Date.now();
        data.modifiedAt = Date.now();

        Poster.create(data, function(err, poster) {
          cb(err, poster)
        });
      })
    });
    async.parallel(_functionArr, function(err, result){
      res.json(201, {res: result, err: err})
    });
  }
};

// Updates an existing poster in the DB.
exports.update = function(req, res) {
  if (req.body) {
    var data = req.body;
    data.modifiedAt =  Date.now();

    Poster.findOneAndUpdate({
      _id: data._id
    }, data, function(err, poster) {
      if (err) {
        return res.json(500);
      } else {
        return res.json(200,
           poster);
      }
    });
  }
};

// Deletes a poster from the DB.
exports.destroy = function(req, res) {
  Poster.findById(req.params.id, function (err, poster) {
    if(err) { return handleError(res, err); }
    if(!poster) { return res.send(404); }
    poster.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

function handleError(res, err) {
  return res.send(500, err);
}
