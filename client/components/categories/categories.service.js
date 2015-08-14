'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Categories', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.categories;

      // Public API here
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        get: function(options) {
          if (!_.isUndefined(options)) {
            if (options.hasOwnProperty('category')) {
              return $http.get(API_ENDPOINT, {
                category: options.category
              });
            }
          }

          return $http.get(API_ENDPOINT);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        deleteImage: function(category) {
          return $http.put(API_ENDPOINT + category._id, category, {
            params: {
              deleteImage: true
            }
          });
        }
      };
    }
  ]);