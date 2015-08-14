'use strict';

angular.module('newsApp', [
    'ngCookies',
    'ngResource',
    'ngSanitize',
    'ui.router',
    'ui.bootstrap',
    'angularFileUpload',
    'ui.sortable',
    'pascalprecht.translate',
    'youtube-embed',
    'ui.calendar',
    'ui.select',
    'ngDragDrop',
    'ui.mask',
    'ui.bootstrap.datetimepicker'

  ])
  .config(function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {
    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');
  })
  // configure the angular-translate
  .config(function($translateProvider) {
    $translateProvider.useStaticFilesLoader({
      prefix: '/assets/languages/',
      suffix: '.json'
    });

    $translateProvider.preferredLanguage('en');
  })
  .config(function($resourceProvider) {
    $resourceProvider.defaults.stripTrailingSlashes = false;
  })

.factory('authInterceptor', function($rootScope, $q, $cookieStore, $location) {
  return {
    // Add authorization token to headers
    request: function(config) {
      config.headers = config.headers || {};
      if ($cookieStore.get('token')) {
        config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
      }
      return config;
    },

    // Intercept 401s and redirect you to login
    responseError: function(response) {
      if (response.status === 401) {
        $location.path('/login');
        // remove any stale tokens
        $cookieStore.remove('token');
        return $q.reject(response);
      } else {
        return $q.reject(response);
      }
    }
  };
})

.filter('percentage', ['$filter', function($filter) {
  return function(input, decimals) {
    return $filter('number')(input * 100, decimals) + '%';
  };
}])

.run(function($rootScope, $location, Auth) {
  // Redirect to login if route requires auth and you're not logged in
  $rootScope.$on('$stateChangeStart', function(event, next) {
    Auth.isLoggedInAsync(function(loggedIn) {
      if (next.authenticate && !loggedIn) {
        $location.path('/login');
      }
    });
  });
});
