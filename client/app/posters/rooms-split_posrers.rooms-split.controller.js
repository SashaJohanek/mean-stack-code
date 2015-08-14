
  'use strict';

  angular.module('newsApp')
    .controller('PostersRoomsSplitCtrl', ['$scope', 'Posters', 'preLoadPosters', 'preLoadRooms',
    function ($scope, Posters, preLoadPosters, preLoadRooms) {

      var self = this;

      self.postersList =preLoadPosters.result;
      self.Rooms = preLoadRooms.result;

      self.onDropMonitor = onDropMonitor;
      self.eventsUpdate = eventsUpdate;
      self.countPosters = countPosters;
      self.selectionOnRoom = selectionOnRoom;
      self.onDropRoom = onDropRoom;
      self.datepicker = datepicker;
      self.updateEventMonitor = updateEventMonitor;


      self.PostersOnRoomWithoutMonitor ={};

      self.currentRoom = {
        left: _.clone(self.Rooms[0]) || []
        ,right: _.clone(self.Rooms[1]) || []
      };

      self.eventMonitor = {
        left: []
        , right: []
      };

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

      function onDropMonitor(event, element) {
        // this function is called when posters is dropped on monitor
        var _id = angular.element(element.draggable).data('id')
          , el
          , monitor_index = angular.element(event.target).data('index')
          , position = angular.element(event.target).data('position')
          , sortOnly = false
          , _currentRoom = self.currentRoom.left;

        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;
          if (!el) return;

          if (position == 'right'){
            _currentRoom = self.currentRoom.right;
          }
          //only for sortable
          if(el.monitor == monitor_index && el.room == _currentRoom._id) sortOnly = true;

          el.monitor = monitor_index;
          el.room = _currentRoom._id;
          el.$save();

          self.eventsUpdate(sortOnly);
        })
      }

      function eventsUpdate(sort) {
        Posters.query().$promise.then(function(response) {
          self.postersList = response.result;
          if(sort) return;
          self.selectionOnRoom()
        });
      }

      function selectionOnRoom() {
        self.eventMonitor.left = [];
        self.eventMonitor.right = [];

        if(self.currentRoom.left.length == 0 ||
          self.currentRoom.right.length == 0) return;

        var _leftRoom = self.currentRoom.left.title
          , _rightRoom = self.currentRoom.right.title
          , _dataInLeftRoom = _.findWhere(self.Rooms, {title: _leftRoom.trim()})
          , _dataInRightRoom = _.findWhere(self.Rooms, {title: _rightRoom.trim()});


        self.currentRoom.left = _.clone(_dataInLeftRoom);
        self.currentRoom.right = _.clone(_dataInRightRoom);

        self.eventMonitor.left = self.updateEventMonitor(_dataInLeftRoom);
        self.eventMonitor.right = self.updateEventMonitor(_dataInRightRoom);
        self.countPosters();
      }

      function updateEventMonitor(data){
        var eventMonitor = [];
        _.each(self.postersList, function(el){
          if(el.room && el.room._id == data._id) {
            if (!eventMonitor[el.monitor]) {
              eventMonitor[el.monitor] = [];
            }
            eventMonitor[el.monitor].push(el);
          }
        });
        return eventMonitor;
      }

      function countPosters() {
        var _leftRoom = self.currentRoom.left
          , _rightRoom = self.currentRoom.right;

        self.PostersOnRoomWithoutMonitor.left = _.where(self.postersList, {monitor: -1, room: _leftRoom._id}).length;
        self.PostersOnRoomWithoutMonitor.right = _.where(self.postersList, {monitor: -1, room: _rightRoom._id}).length;
      }

      function onDropRoom(event, element) {
        // this function is called when posters is dropped on room and not on monitor
        var _id = angular.element(element.draggable).data('id')
          , position = angular.element(event.target).data('position')
          , _currentRoom = self.currentRoom.left
          , el;
        Posters.get({id: _id}).$promise.then(function(response) {
          el = response;

          // if something went wrong, abort
          if (!el) return;

          if (position == 'right'){
            _currentRoom = self.currentRoom.right;
          }

          el.room = _currentRoom._id;
          el.monitor = -1;
          el.$save();

          self.eventsUpdate();
        })

      }

      function datepicker() {
        angular.element("#left-datepicker").datepicker();
        angular.element("#right-datepicker").datepicker();
      }
    }

  ]);
