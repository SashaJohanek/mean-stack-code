'use strict';

angular.module('newsApp')
  .config(function($stateProvider) {
    $stateProvider
      .state('login', {
        url: '/login',
        templateUrl: 'app/account/login/login.html',
        controller: 'LoginCtrl'
      })
      .state('signup', {
        url: '/signup',
        templateUrl: 'app/account/signup/signup.html',
        controller: 'SignupCtrl'
      })
      .state('create', {
        url: '/create',
        templateUrl: 'app/account/create/create.html',
        controller: 'CreateCtrl'
      })
      .state('edit', {
        url: '/:id/edit',
        templateUrl: 'app/account/create/create.html',
        controller: 'EditCtrl'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'app/account/settings/settings.html',
        controller: 'SettingsCtrl',
        authenticate: true
      });
  });
