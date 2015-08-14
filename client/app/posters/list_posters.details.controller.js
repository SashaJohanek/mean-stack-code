'use strict'

angular.module('newsApp')
  .controller('PostersDetailsCtrl', ['$scope', '$stateParams', 'Rooms', 'Posters', '$filter',
    function($scope, $stateParams, Rooms, Posters, $filter) {
      // hold the details data
      $scope.data = {
        model: {}
      };

      $scope.selects = {
        room : null,
        monitor : null,
        date : $filter('date')(new Date(), 'yyyy MMM dd, hh:mm a')
      };
      // fetch single page
      Posters.get({id : $stateParams.id}).$promise.then(function(response) {
        var body = response;
        $scope.data.model = body;
        $scope.selects.date = $scope.data.model.startDate ? $filter('date')(new Date($scope.data.model.startDate), 'yyyy MMM dd, hh:mm a') : null;

        if (!$scope.data.model.room) return
        Rooms.get({id : $scope.data.model.room }).$promise.then(function(res) {
          $scope.selects.room = res;
          $scope.selects.monitor = $scope.selects.room.monitors[$scope.data.model.monitor];
        });
      });
    }
  ]);
