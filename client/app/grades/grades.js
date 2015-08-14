'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/grades',
        views: {
          '': {
            templateUrl: 'app/grades/grades.html'
          },
          'leftPane@grades': {
            templateUrl: 'app/grades/view-list.html',
            controller: 'GradesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@grades': {
            templateUrl: 'app/grades/form-add.html',
            controller: 'GradesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@grades': {
            templateUrl: 'app/grades/form-update.html',
            controller: 'GradesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@grades': {
            templateUrl: 'app/grades/view-details.html',
            controller: 'GradesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('grades', states.list)
      .state('grades.add', states.add)
      .state('grades.update', states.update)
      .state('grades.details', states.details);
  });
