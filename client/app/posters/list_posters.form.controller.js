'use strict';
angular.module('newsApp')
  .controller('PostersFormCtrl', ['$scope', '$filter', '$rootScope', '$state', 'Rooms', 'Posters',
    function ($scope, $filter, $rootScope, $state, Rooms, Posters) {


      $scope.Add_Update = 'add';
      $scope.roomId = '';
      $scope.selects = {
        room: null,
        rooms: [],
        monitor: null
      };

      if ($state.params != null && typeof $state.params.id !== 'undefined') {
        $scope.posterId = $state.params.id;
        $scope.Add_Update = 'update';
      }

      $scope.data = {
        model: {
          title  : '',
          code : '',
          presentationType : '',
          room : [],
          monitor : -1,
          startDate : null,
          duration : 1440
        }
      };

      $scope.ui = {};
      $scope.ui.progress = 0;
      $scope.ui.inProgress = false;

      Rooms.query().$promise.then(function(response) {
        $scope.selects.rooms = response.result;
        $scope.selects.rooms.unshift({
          title: 'No room'
          , _id: null
          ,monitors: []
        });
        $scope.selects.room = $scope.selects.rooms[0];

        if ($scope.Add_Update == 'update') {
          Posters.get({id: $scope.posterId}).$promise.then(function(response) {
            var body = response;
            $scope.data.model = response;
            $scope.dt = $scope.data.model.startDate ? $filter('date')(new Date($scope.data.model.startDate), 'yyyy MMM dd, hh:mm a') : null;
            angular.forEach($scope.selects.rooms, function(item, index) {
              if (item._id == $scope.data.model.room) {
                $scope.selects.room = item;
                $scope.selects.room.monitors.unshift({
                  title: 'No monitor'
                  , _id: null
                })
                return false;
              }
            });

            $scope.selects.monitor = $scope.selects.room.monitors[$scope.data.model.monitor +1];
            $scope.selects.monitor.index = $scope.data.model.monitor +1;
          });
        } else {
          $scope.onselectRoom();
        }
      });

      // datapicker functions

      $scope.today = function() {
        $scope.dt = $filter('date')(new Date(), 'yyyy MMM dd, hh:mm a');
      };
//      $scope.today();

      $scope.clear = function () {
        $scope.dt = null;
      };


      $scope.open = function($event) {

        $event.preventDefault();
        $event.stopPropagation();
        $scope.opened = true;
      };

      $scope.dateOptions = {
        formatYear: 'yyyy',
        startingDay: 1
      };

      $scope.onselectRoom = function() {
        if(!$scope.selects.room.monitors[0] || $scope.selects.room.monitors[0]._id){
          $scope.selects.room.monitors.unshift({
            title: 'No monitor'
            , _id: null
          })
        }
        $scope.selects.monitor = $scope.selects.room.monitors[0];
        $scope.selects.monitor.index = 0;
        $scope.data.model.room = $scope.selects.room._id;
       }

      function progressStart() {
        $scope.ui.inProgress = true;
      }

      function progressEnd() {
        $scope.ui.inProgress = false;
      }

      /*
       * Handle the add form submission
       */
      $scope.save = function() {
        // if the form is not valid then cut the flow
        if (!$scope.addForm.$valid) return;

        progressStart();

        $scope.data.model.monitor =$scope.selects.monitor.index -1;
        $scope.data.model.startDate = new Date($scope.dt).getTime() || $scope.data.model.startDate;

        if ($scope.Add_Update == 'update') {

          // update room data

          $scope.data.model.$save(function onSuccess(response) {
            // notify the listener when the record is added
            $scope.$emit('list_updated');

            $state.transitionTo('posters.details', {id:response._id}, {
              reload: true
            });
          },function onError() {
            progressEnd();
          });

        }
        else {

          // save new room data

          Posters.save($scope.data.model).$promise.then(function onSuccess(){
            // notify the listener when the record is added
            $scope.$emit('list_updated');

            $state.transitionTo($state.current, {}, {
              reload: true
            });
          },function onError() {
            progressEnd();
          });

        }
      };

    }]);
