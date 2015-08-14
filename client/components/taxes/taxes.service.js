'use strict';

/**
 * Factory service to handle API request
 */
angular.module('newsApp')
  .factory('Taxes', [
    function() {

      var taxes = [
        {
          name: '15%',
          value: .15,
        },
        {
          name: '25%',
          value: .25,
        }
      ]
      // Public API here
      return {
        get: function() {
          return taxes;
        }
      };
    }
  ]);
