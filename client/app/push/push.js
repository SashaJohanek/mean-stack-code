'use strict';

angular.module('newsApp')
  .config(function ($stateProvider) {
    $stateProvider
      .state('push', {
        url: '/push',
        templateUrl: 'app/push/push.html',
        controller: 'PushCtrl'
      });
  });