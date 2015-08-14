'use strict';

var mongoose = require('mongoose'),
  mUtilities = require('mongoose-utilities'),
  moment = require('moment'),
  Schema = mongoose.Schema,
  async = require('async');

var OrderSchema = new Schema({
  userId: String,
  date: Number, // Milliseconds elapsed since 1 January 1970 00:00:00 UTC.
  status: String,
  deliveryMethod: String,
  restaurant: {
    name: String,
    address: String,
    zip: String,
    city: String,
    notes: String //Delivery notes
  },
  shipping: {
    fullname: String,
    address: String,
    zip: String,
    city: String,
    notes: String //Delivery notes
  },
  items: [{
    name: String,
    quantity: Number,
    variant: String,
    unitPrice: Number,
    totalPrice: Number,
    preparationTime: Number,
    tax: {
      percentage: Number,
      value: Number
    }
  }],
  grandTotal: Number,
  // we use this field when the first time news created
  createdAt: Number,
  // we use this field when the news is updated
  modifiedAt: Number
});

OrderSchema.virtual('preparationTime').get(function() {
  var sum = 0;
  for (var i in this.items) {
    sum = sum + this.items[i].preparationTime;
  }
  return sum;
});

/**
 * Calculate total income
 * @param {string} the user identifier to be query
 * @returns {function} return the function contained the task to calculate total
 * income
 */
OrderSchema.statics.calculateTotalIncome = function(userId) {
  var self = this;

  return function(callback) {

    var aggregationPipeline = [{
      $match: {
        userId: userId
      }
    }, {
      $group: {
        _id: 'totalIncome',
        totalIncome: {
          $sum: '$grandTotal'
        }
      }
    }];

    self.aggregate(aggregationPipeline, function(err, result) {
      if (err) {
        callback(new Error('Cannot calculate the total income'));
      }

      if (result.length > 0) {
        callback(null, result[0].totalIncome);
      } else {
        // we got nothing
        callback(null, null);
      }
    });
  };
};

/**
 * Calculate total income for this month
 * @returns {function} return the function contained the task to calculate total
 * income for this month
 */
OrderSchema.statics.calculateTotalIncomeForThisMonth = function(userId) {
  var self = this;

  return function(callback) {
    var startOfMonth = moment().startOf('month').unix() * 1000;
    var endOfMonth = moment().endOf('month').unix() * 1000;

    var aggregationPipeline = [{
      $match: {
        userId: userId
      }
    }, {
      $match: {
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    }, {
      $group: {
        _id: null,
        totalIncomeForThisMonth: {
          $sum: '$grandTotal'
        }
      }
    }];

    self.aggregate(aggregationPipeline, function(err, result) {
      if (err) {
        callback(new Error('Cannot calculate the tocal income for this month'));
      }

      if (result.length > 0) {
        callback(null, result[0].totalIncomeForThisMonth)
      } else {
        // we got nothing
        callback(null, null);
      }
    });
  };
};

/**
 * Calculate total income for this year
 * @param {string} the user identifier to be query
 * @returns {function} return the function contained the task to calculate total
 * income for this year
 */
OrderSchema.statics.calculateTotalIncomeForThisYear = function(userId) {
  var self = this;

  return function(callback) {
    var startOfYear = moment().startOf('year').unix() * 1000;
    var endOfYear = moment().endOf('year').unix() * 1000;

    var aggregationPipeline = [{
      $match: {
        userId: userId
      }
    }, {
      $match: {
        date: {
          $gte: startOfYear,
          $lte: endOfYear
        }
      }
    }, {
      $group: {
        _id: null,
        totalIncomeForThisYear: {
          $sum: '$grandTotal'
        }
      }
    }];

    self.aggregate(aggregationPipeline, function(err, result) {
      if (err) {
        callback(new Error('Cannot calculate the tocal income for this year'));
      }

      if (result.length > 0) {
        callback(null, result[0].totalIncomeForThisYear)
      } else {
        // we got nothing
        callback(null, null);
      }
    });
  };
};

/**
 * Calculate total orders
 * @param {string} the user identifier to be query
 * @returns {function} return the function contained the task to calculate total
 * orders
 */
OrderSchema.statics.calculateTotalOrders = function(userId) {
  var self = this;

  return function(callback) {
    var query = {
      userId: userId
    };

    self.count(query, function(err, result) {
      callback(null, result);
    });
  };
};

/**
 * Calculate orders for this month
 * @param {string} the user identifier to be query
 * @returns {function} return the function contained the task to calculate orders
 * for this month
 */
OrderSchema.statics.calculateOrdersForThisMonth = function(userId) {
  var self = this;

  return function(callback) {
    var startOfMonth = moment().startOf('month').unix() * 1000;
    var endOfMonth = moment().endOf('month').unix() * 1000;

    var aggregationPipeline = [{
      $match: {
        userId: userId
      }
    }, {
      $match: {
        date: {
          $gte: startOfMonth,
          $lte: endOfMonth
        }
      }
    }];

    self.aggregate(aggregationPipeline, function(err, result) {
      if (err) {
        callback(new Error('Cannot calculate the total orders for this month'));
      }

      if (result.length) {
        callback(null, result.length);
      } else {
        // we got nothing
        callback(null, null);
      }
    });
  };
};

/**
 * Calculate orders for this year
 * @param {string} the user identifier to be query
 * @returns {function} return the function contained the task to calculate orders
 * for this year
 */
OrderSchema.statics.calculateOrdersForThisYear = function(userId) {
  var self = this;

  return function(callback) {
    var startOfYear = moment().startOf('year').unix() * 1000;
    var endOfYear = moment().endOf('year').unix() * 1000;

    var aggregationPipeline = [{
      $match: {
        userId: userId
      }
    }, {
      $match: {
        date: {
          $gte: startOfYear,
          $lte: endOfYear
        }
      }
    }];

    self.aggregate(aggregationPipeline, function(err, result) {
      if (err) {
        callback(new Error('Cannot calculate the total orders for this year'));
      }

      if (result.length) {
        callback(null, result.length);
      } else {
        // we got nothing
        callback(null, null);
      }
    });
  };
};

/**
 * Get the orders summary with the following informations:
 * - total income for this month
 * - total income for this year
 * - total orders for this month
 * - total orders for this year
 * - total income
 * - total orders
 *
 * @param {string} userId user indetifier
 * @param {function} cb callback function
 * @return {undefined}
 */
OrderSchema.statics.getSummary = function(userId, cb) {
  var self = this;

  var tasks = {
    totalIncome: self.calculateTotalIncome(userId),
    totalIncomeForThisMonth: self.calculateTotalIncomeForThisMonth(userId),
    totalIncomeForThisYear: self.calculateTotalIncomeForThisYear(userId),
    totalOrders: self.calculateTotalOrders(userId),
    ordersForThisMonth: self.calculateOrdersForThisMonth(userId),
    ordersForThisYear: self.calculateOrdersForThisYear(userId)
  };

  async.parallel(tasks, function(err, results) {
    if (err) {
      cb(new Error('Cannot populate the summary'));
    }

    cb(null, results);
  });
};

OrderSchema.plugin(mUtilities.pagination);

module.exports = mongoose.model('Order', OrderSchema);
