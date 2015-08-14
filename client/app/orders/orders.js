'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/orders',
        views: {
          '': {
            templateUrl: 'app/orders/orders.html'
          },
          'mainPane@orders': {
            templateUrl: 'app/orders/view-list.html',
            controller: 'OrdersListCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id?ref',
        views: {
          'mainPane@orders': {
            templateUrl: 'app/orders/view-details.html',
            controller: 'OrdersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('orders', states.list)
      .state('orders.details', states.details);
  });
