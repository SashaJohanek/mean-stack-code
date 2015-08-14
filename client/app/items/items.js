'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/items',
        views: {
          '': {
            templateUrl: 'app/items/items.html'
          },
          'leftPane@items': {
            templateUrl: 'app/items/view-list.html',
            controller: 'ItemsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@items': {
            templateUrl: 'app/items/form-add.html',
            controller: 'ItemsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@items': {
            templateUrl: 'app/items/form-update.html',
            controller: 'ItemsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@items': {
            templateUrl: 'app/items/view-details.html',
            controller: 'ItemsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('items', states.list)
      .state('items.add', states.add)
      .state('items.update', states.update)
      .state('items.details', states.details);
  });