'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Topics', ['API', '$http',
    function(API, $http) {

      var API_ENDPOINT = API.url + API.endpoint.topics;

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
            if (options.hasOwnProperty('topic')) {
              return $http.get(API_ENDPOINT, {
                topic: options.topic
              });
            }
          }

          return $http.get(API_ENDPOINT);
        },
        getByCourse: function(courseId) {
          return $http.get(API_ENDPOINT + 'course/' + courseId);
        },
        findOne: function(id) {
          return $http.get(API_ENDPOINT + id);
        },
        delete: function(id) {
          return $http.delete(API_ENDPOINT + id);
        },
        deleteImage: function(topic) {
          return $http.put(API_ENDPOINT + topic._id, topic, {
            params: {
              deleteImage: true
            }
          });
        },
        /**
         * Add the "deepName" property with mention
         * to the parent course and grade this topic belongs to
         * This property will be used for the label
         * in the select control for the topics
         * @param {Array} topics an array containing the topic list
         */
        map: function(topics) {
          // add the `deepName` property to each of existing topic item
          return topics.map(
            function(topic) {
              var grade = ''
              var course = ''

              try {
                grade = topic.course.grade.name
              } catch (e) {
                console.log('Topic: no parent grade found');
              }

              try {
                course = topic.course.name
              } catch (e) {
                console.log('Topic: no parent course found');
              }

              topic.deepName = grade + ' :: ' + course + ' :: ' + topic.name;
              return topic;
            });
        }
      };
    }
  ]);
