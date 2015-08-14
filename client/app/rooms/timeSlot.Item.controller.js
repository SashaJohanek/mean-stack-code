'use strict';

angular.module('newsApp')
    .controller('TimeSlotItemCtrl', ['$scope', function($scope) {

      /**
       * Remove question inputs by the element index
       */

      $scope.opened = [];
      $scope.opened1 = [];
      $scope.removeTimeSlot = function(index) {
        $scope.data.model.availability.splice(index, 1);
      };


      $scope.open = function($event, idx) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened[idx] = true;
      };

      $scope.open1 = function($event, idx) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened1[idx] = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };
    }]);