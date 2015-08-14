'use strict';

var _ = require('lodash');
var Room = require('./room.model');


// Get list of rooms
exports.index = function(req, res) {

  if (req.query.page == null) {

    // all rooms
    Room.find({
      createdBy: req.user._id.toString()
    })
    .sort({'startDate': 1})
    .exec(function (err, rooms) {
      if(err) { return handleError(res, err); }
      return res.json(200, {
          result : rooms
      });
    });

  }
  else {

    // page navigation

    Room.paginate({
      query: {
        createdBy: req.user._id
      },
      page: parseInt(req.query.page) || 1,
      limit: parseInt(req.query.limit) || 5,
      sort: {
        'startDate': 1
      }
    }, function(err, provider) {
      if (err) {
        return handleError(res, err);
      }

      res.json(200, {
        page: provider.page,
        page_size: 5,
        total: provider.docs.length,
        num_pages: provider.pages,
        result: provider.docs
      });
    });
  }

};

// Get a single room
exports.show = function(req, res) {
  Room.findOne({
    _id: req.params.id,
    createdBy: req.user._id.toString()
  }, function (err, room) {
    if(err) { return handleError(res, err); }
    if(!room) { return res.send(404); }
    return res.json(200, room);
  });
};

// Creates a new room in the DB.
exports.create = function(req, res) {
  if (req.body) {

    var data = req.body;
    data.createdBy = req.user._id.toString();
    data.createdAt = Date.now();
    data.modifiedAt = Date.now();

    Room.create(data, function(err, room) {
      if(err) { return handleError(res, err); }
      return res.json(201, room);
    });

  };
};

// Updates an existing room in the DB.
exports.update = function(req, res) {
  if (req.body) {
    var data = req.body;
    data.modifiedAt =  Date.now();

    Room.findOneAndUpdate({
      _id: data._id
    }, data, function(err, room) {
      if (err) {
        return res.json(500);
      } else {
        return res.json(200,
           room);
      }
    });
  }
};

// Deletes a room from the DB.
exports.destroy = function(req, res) {
  Room.findById(req.params.id, function(err, room) {
    if (err) {
      return handleError(res, err);
    }
    if (!room) {
      return res.send(404);
    }
    room.remove(function(err) {
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
