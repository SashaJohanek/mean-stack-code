'use strict';

angular.module('newsApp')
  .factory('User', function($resource) {
    return $resource('/api/users/:id/:controller', {
      id: '@_id'
    }, {
      changePassword: {
        method: 'PUT',
        params: {
          controller: 'password'
        }
      },
      feature: {
        method: 'PUT',
        params: {
          controller: 'feature',
          featured: '@featured'
        }
      },
      expire: {
        method: 'PUT',
        params: {
          controller: 'expire',
          expiration: '@expiration'
        }
      },
      get: {
        method: 'GET',
        params: {
          id: 'me'
        }
      },
      show: {
        method: 'GET',
        params: {
          controller: 'show',
        }
      }
    });
  });
