'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/topics',
        views: {
          '': {
            templateUrl: 'app/topics/topics.html'
          },
          'leftPane@topics': {
            templateUrl: 'app/topics/view-list.html',
            controller: 'TopicsListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@topics': {
            templateUrl: 'app/topics/form-add.html',
            controller: 'TopicsAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@topics': {
            templateUrl: 'app/topics/form-update.html',
            controller: 'TopicsUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@topics': {
            templateUrl: 'app/topics/view-details.html',
            controller: 'TopicsDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('topics', states.list)
      .state('topics.add', states.add)
      .state('topics.update', states.update)
      .state('topics.details', states.details);
  });
