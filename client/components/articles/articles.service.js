'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Articles', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.articles;

      // Public API here
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
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        deleteImage: function(article) {
          return $http.put(API_ENDPOINT + article._id, article, {
            params: {
              deleteImage: true
            }
          });
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
