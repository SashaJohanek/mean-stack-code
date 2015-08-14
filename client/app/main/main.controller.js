'use strict';

angular.module('newsApp')
  .controller('MainCtrl', ['$scope', 'Orders',
    function($scope, Orders) {
      Orders
        .getSummary()
        .success(function(data, status, headers, config) {
          $scope.data = data;
        }).error(function(data, status, headers, config) {
          // TODO inform the user when we failed to load the summary
        });

      $(window).trigger('resize');
    }
  ]);