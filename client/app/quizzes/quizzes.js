'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/quizzes',
        views: {
          '': {
            templateUrl: 'app/quizzes/quizzes.html'
          },
          'leftPane@quizzes': {
            templateUrl: 'app/quizzes/view-list.html',
            controller: 'QuizzesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@quizzes': {
            templateUrl: 'app/quizzes/form-add.html',
            controller: 'QuizzesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@quizzes': {
            templateUrl: 'app/quizzes/form-update.html',
            controller: 'QuizzesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@quizzes': {
            templateUrl: 'app/quizzes/view-details.html',
            controller: 'QuizzesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('quizzes', states.list)
      .state('quizzes.add', states.add)
      .state('quizzes.update', states.update)
      .state('quizzes.details', states.details);
  });