'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    var states = {
      list: {
        url: '/rooms',
        views: {
          '': {
            templateUrl: 'app/rooms/rooms.html'
          },
          'leftPane@rooms': {
            templateUrl: 'app/rooms/view-list.html',
            controller: 'RoomsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/form.html',
            controller: 'RoomsFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/form.html',
            controller: 'RoomsFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@rooms': {
            templateUrl: 'app/rooms/view-details.html',
            controller: 'RoomsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('rooms', states.list)
      .state('rooms.add', states.add)
      .state('rooms.update', states.update)
      .state('rooms.details', states.details);
  });
