'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Posters', ['API', '$resource',
    function(API, $resource) {

      return $resource( API.url + API.endpoint.posters + ':id', {id:'@_id'},
      {
        query: {
          method : 'GET',
          page : 'page'
        }
      });

  }]);
