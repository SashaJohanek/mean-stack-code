'use strict';

var _ = require('lodash');
var Order = require('./order.model');

var pub = {
  create: function(req, res) {
    console.log("post received" + JSON.stringify(req.body));

    Order.create(req.body, function(err, order) {
      if(err) { return handleError(res, err); }
      return res.json(201, {result: order});
    });
  }
};

// Get list of categorys
exports.public = pub;

// Get list of orders
exports.index = function(req, res) {
  // Order.find(function (err, orders) {
  //   if(err) { return handleError(res, err); }
  //   return res.json(200, {result: orders});
  // });


  Order.paginate({
    query: {
      // userId: req.user._id
    },
    page: parseInt(req.query.page) || 1,
    limit: parseInt(req.query.limit) || 10,
    sort: {
      date: -1
    }
  }, function(err, provider) {
    if (err) {
      return handleError(res, err);
    }

    res.json(200, {
      page: provider.page,
      page_size: 10,
      total: provider.docs.length,
      num_pages: provider.pages,
      result: provider.docs
    });
  });

};

// Get a single order
exports.show = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    // return res.json(order);
    return res.json(200, {result: order});
  });
};

// Creates a new order in the DB.
exports.create = function(req, res) {
  Order.create(req.body, function(err, order) {
    if(err) { return handleError(res, err); }
    return res.json(201, {result: order});
  });
};

// Updates an existing order in the DB.
exports.update = function(req, res) {
  if(req.body._id) { delete req.body._id; }
  Order.findById(req.params.id, function (err, order) {
    if (err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    var updated = _.merge(order, req.body);
    updated.save(function (err) {
      if (err) { return handleError(res, err); }
      return res.json(200, {result: order});
    });
  });
};

// Deletes a order from the DB.
exports.destroy = function(req, res) {
  Order.findById(req.params.id, function (err, order) {
    if(err) { return handleError(res, err); }
    if(!order) { return res.send(404); }
    order.remove(function(err) {
      if(err) { return handleError(res, err); }
      return res.send(204);
    });
  });
};

// populate the information for dashboards
exports.summary = function(req, res) {
  Order.getSummary(req.user._id.toString(), function(err, result) {
    if (err) {
      return handleError(res, err);
    }
    if (!result) {
      return res.send(404);
    }

    return res.send(200, result);
  });
}

function handleError(res, err) {
  console.log(err);
  return res.send(500, err);
}
