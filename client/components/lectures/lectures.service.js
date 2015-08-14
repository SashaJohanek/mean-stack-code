'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .service('Lectures', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.lectures;

      // Public API here
      return {
        create: function(data) {
          return $http.post(API_ENDPOINT, data);
        },
        update: function(id, data) {
          return $http.put(API_ENDPOINT + id, data);
        },
        get: function() {
          return $http.get(API_ENDPOINT);
        },
        getByTopic: function(topicId) {
          return $http.get(API_ENDPOINT + 'topic/' + topicId);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        deleteImage: function(record) {
          return $http.put(API_ENDPOINT + record._id, record, {
            params: {
              deleteImage: true
            }
          });
        }
      };
    }
  ]);