'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {

    var states = {
      list: {
        url: '/offers',
        views: {
          '': {
            templateUrl: 'app/offers/offers.html',
            controller: 'OffersCtrl'
          },
          'leftPane@offers': {
            templateUrl: 'app/offers/view-list.html',
            controller: 'OffersListCtrl'
          }
        },
        authenticate: true
      },
      add: {
        views: {
          'rightPane@offers': {
            templateUrl: 'app/offers/form-add.html',
            controller: 'OffersAddFormCtrl'
          }
        },
        authenticate: true
      },
      update: {
        url: '/:id/edit',
        views: {
          'rightPane@offers': {
            templateUrl: 'app/offers/form-update.html',
            controller: 'OffersUpdateFormCtrl'
          }
        },
        authenticate: true
      },
      details: {
        url: '/:id',
        views: {
          'rightPane@offers': {
            templateUrl: 'app/offers/view-details.html',
            controller: 'OffersDetailsCtrl'
          }
        },
        authenticate: true
      }
    };

    $stateProvider
      .state('offers', states.list)
      .state('offers.add', states.add)
      .state('offers.update', states.update)
      .state('offers.details', states.details);
  });
