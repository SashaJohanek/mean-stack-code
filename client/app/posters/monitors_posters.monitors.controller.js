  'use strict';

  angular.module('newsApp')
    .controller('PostersMonitorsCtrl', ['$scope', 'Posters', 'preLoadPosters', 'preLoadRooms',
    function($scope, Posters, preLoadPosters, preLoadRooms) {
      var self = this;

      self.postersList =preLoadPosters.result;
      self.Rooms = preLoadRooms.result;
      self.assigned = false;


      self.onDropMonitor = onDropMonitor;
      self.eventsUpdate = eventsUpdate;
      self.currentEventsLog = currentEventsLog;
      self.countPosters = countPosters;
      self.selectionOnRoom = selectionOnRoom;
      self.onDropRoom = onDropRoom;
      self.datepicker = datepicker;
      self.View = View;
      self.Add = Add;
      self.filteringByAssigned = filteringByAssigned;
      self.isPosterAssigned = isPosterAssigned;

      self.eventMonitor = [];
      self.currentRoom = self.Rooms[0] || [];
      self.selectedPresentationType = '';

      self.sortableOptions = {
        update: function(e, ui) {
          console.log("Monitor updated:", e, ui);
        },
        change: function(e, ui) {
          console.log("Monitor change:", e, ui);
        }
      };

      activate();
      function activate(){
        self.selectionOnRoom();
        self.datepicker();
      }

      function View(id) {
        $scope.BtnView = true;
        $scope.BtnUpdate = false;
        self.postersList.forEach(function (item) {
          if (item._id == id) {
            self.posterInf = angular.copy(item);
  //          console.log('posterInf', self.posterInf, item)
          }
        });
      }

      function Add() {
        $scope.BtnUpdate = false;
        $scope.BtnView = false;
        self.posterInf = {
          _id: '',
          title: '',
          body: '',
          room: '',
          monitor: '',
          startDate: ''
        };
      }


      function onDropMonitor(event, element) {
        // this function is called when posters is dropped on monitor
        var _id = angular.element(element.draggable).data('id')
          , monitor_index = angular.element(event.target).data('index')
          , sortOnly = false
          , el;

        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
        // if something went wrong, abort
          if (!el) return;

          //only for sortable
          if(el.monitor == monitor_index && el.room == self.currentRoom._id) sortOnly = true;

          el.monitor = monitor_index;
          el.room = self.currentRoom._id;
          el.$save();

          self.eventsUpdate(sortOnly);
        })
      }


      function onDropRoom(event, element) {
        // this function is called when posters is dropped on room and not on monitor
        var _id = angular.element(element.draggable).data('id')
          ,el

        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          // if something went wrong, abort
          if (!el) return;
          el.monitor = -1;
          el.room = self.currentRoom._id;
          el.$save();

          self.eventsUpdate();
        })
      }


      function eventsUpdate(sort) {
        Posters.query().$promise.then(function(response) {
          self.postersList = response.result;
          if(sort) return;
          self.selectionOnRoom()
        });
      }

      function currentEventsLog() {
        console.log('currentEventsLog', Posters.get());
      }

      function selectionOnRoom() {
        self.eventMonitor =[];
        self.postersList.forEach(function (item) {
          if(item.room && item.room._id == self.currentRoom._id) {
            self.eventMonitor[item.monitor] = self.eventMonitor[item.monitor] || [];
            self.eventMonitor[item.monitor].push(item)
            }
        });
        self.countPosters()
      }

      function countPosters() {
        var _roomId = self.currentRoom._id;
        self.PostersOnRoomWithoutMonitor = _.where(self.postersList, {monitor: -1, room: _roomId}).length
      }

      function isPosterAssigned(poster){
        var hasRoom    = false;
        var hasMonitor = false;

        if (poster.room){
          hasRoom = true;
        }

        if (poster.monitor && poster.monitor > -1){
          hasMonitor = true;
        }

        return (hasRoom && hasMonitor)
      }

      function filteringByAssigned(poster) {
        var filter = self.assigned

        if (filter){
          return true //Display All
        }else{
          return !(isPosterAssigned(poster));
        }


        // Note: Please do not remove the commented code below
        //       we are not yes completelry sure how this should work.
        //

        // var hasRoom    = false;
        // var hasMonitor = false;
        //
        // if (poster.room){
        //   hasRoom = true;
        // }
        //
        // if (poster.monitor && poster.monitor > -1){
        //   hasMonitor = true;
        // }

        // return (isPosterAssigned(poster) === filter)

        /*
         if(self.assigned){
         if(poster.room && poster.monitor != -1) return true
         return false
         } else {
         if( !(poster.room) || poster.monitor < 0) return true
         return false
         //return true
         }
         */
      }


      function datepicker() {
        angular.element("#datepicker").datepicker();
      }

    }


  ]);
