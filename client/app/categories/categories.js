'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/categories',
        views: {
          '': {
            templateUrl: 'app/categories/categories.html'
          },
          'leftPane@categories': {
            templateUrl: 'app/categories/view-list.html',
            controller: 'CategoriesListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@categories': {
            templateUrl: 'app/categories/form-add.html',
            controller: 'CategoriesAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@categories': {
            templateUrl: 'app/categories/form-update.html',
            controller: 'CategoriesUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@categories': {
            templateUrl: 'app/categories/view-details.html',
            controller: 'CategoriesDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('categories', states.list)
      .state('categories.add', states.add)
      .state('categories.update', states.update)
      .state('categories.details', states.details);
  });