'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/courses',
        views: {
          '': {
            templateUrl: 'app/courses/courses.html'
          },
          'leftPane@courses': {
            templateUrl: 'app/courses/view-list.html',
            controller: 'CoursesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@courses': {
            templateUrl: 'app/courses/form-add.html',
            controller: 'CoursesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@courses': {
            templateUrl: 'app/courses/form-update.html',
            controller: 'CoursesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@courses': {
            templateUrl: 'app/courses/view-details.html',
            controller: 'CoursesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('courses', states.list)
      .state('courses.add', states.add)
      .state('courses.update', states.update)
      .state('courses.details', states.details);
  });
