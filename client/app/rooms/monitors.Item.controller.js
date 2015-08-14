
'use strict';

angular.module('newsApp')
    .controller('MonitorsItemCtrl', ['$scope', function($scope) {

      /**
       * Remove question inputs by the element index
       */
      $scope.removeMonitors = function(index) {
        $scope.data.model.monitors.splice(index, 1);
      };
    }]);