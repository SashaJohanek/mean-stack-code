'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Offers', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.offers;

      // Public APIs
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        get: function(page) {
          return $http.get(API_ENDPOINT, {
            params: {
              page: page
            }
          });
        },
        active: function(id, data) {
          return $http.get(API_ENDPOINT + 'active');
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        }
      };
    }
  ]);
