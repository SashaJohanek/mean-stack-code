'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/lectures',
        views: {
          '': {
            templateUrl: 'app/lectures/lectures.html'
          },
          'leftPane@lectures': {
            templateUrl: 'app/lectures/view-list.html',
            controller: 'LecturesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@lectures': {
            templateUrl: 'app/lectures/form-add.html',
            controller: 'LecturesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@lectures': {
            templateUrl: 'app/lectures/form-update.html',
            controller: 'LecturesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@lectures': {
            templateUrl: 'app/lectures/view-details.html',
            controller: 'LecturesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('lectures', states.list)
      .state('lectures.add', states.add)
      .state('lectures.update', states.update)
      .state('lectures.details', states.details);
  });
