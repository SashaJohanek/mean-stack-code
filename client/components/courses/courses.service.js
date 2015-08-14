'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Courses', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.courses;

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
            if (options.hasOwnProperty('course')) {
              return $http.get(API_ENDPOINT, {
                course: options.course
              });
            }
          }

          return $http.get(API_ENDPOINT);
        },
        getByGrade: function(catId) {
          return $http.get(API_ENDPOINT + 'grade/' + catId);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        deleteImage: function(course) {
          return $http.put(API_ENDPOINT + course._id, course, {
            params: {
              deleteImage: true
            }
          });
        }
      };
    }
  ]);
