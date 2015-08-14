'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('business', {
        url: '/business',
        templateUrl: 'app/accounts/business.html',
        controller: 'AccountsCtrl'
      })
      .state('photos', {
        url: '/photos',
        templateUrl: 'app/accounts/photos.html',
        controller: 'AccountsCtrl'
      })
      .state('invoice', {
        url: '/invoice',
        templateUrl: 'app/accounts/invoice.html',
        controller: 'AccountsCtrl'
      })
      .state('contact', {
        url: '/contact',
        templateUrl: 'app/accounts/contact.html',
        controller: 'AccountsCtrl'
      });
  });
