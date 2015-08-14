
'use strict';

angular.module('newsApp')
    .controller('RoomsDetailsCtrl', ['$scope', '$stateParams', 'Rooms', '$filter',
      function($scope, $stateParams, Rooms, $filter) {
        // hold the details data
        $scope.data = {
          model: {}
        };

        $scope.timeslots = [];
        // fetch single page
        Rooms.get({id : $stateParams.id}).$promise.then(function(response) {
          var body = response;
          $scope.data.model = body;

          angular.forEach($scope.data.model.availability, function(item, index) {
            $scope.timeslots.push({
              startDate : $filter('date')(new Date(item.startDate), 'MMM dd, hh:mm a'),
              endDate : $filter('date')(new Date(item.endDate), 'MMM dd, hh:mm a')
            });
          });

        });
      }
    ]);