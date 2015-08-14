'use strict';

ddescribe('posters.rooms.controller', function() {
  describe('Controller: PostersRoomsSplitCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl
      ,scope
      ,httpBackend
      ,Posters
      ,preLoadPosters = [{
          _id:"11s",
          title: "Poster 1",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: 1
        }, {
          _id:"12a",
          title: "Poster 2",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: 2
        }, {
          _id:"15h",
          title: "Poster 3",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: 3
        }, {
          _id:"17ui",
          title: "Poster 4",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: 4
        }]
      ,preLoadRooms = [{
          _id: 1,
          title: 'room 1'
        }, {
          _id: 2,
          title: 'room 2'
        }, {
          _id: 3,
          title: 'room 3'
        }]
      ,updatedPoster = {
          _id:"11s",
          title: "Poster 1",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: -1
        };

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$controller_, $rootScope, $httpBackend, Posters) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend;
      Posters = Posters;
      Ctrl = _$controller_('PostersRoomsSplitCtrl', {
        $scope: scope
        ,preLoadPosters: {result: preLoadPosters}
        ,preLoadRooms: {result: preLoadRooms}
      });
      httpBackend.when('GET', '/api/posters/11s').respond(preLoadPosters[0]);
      httpBackend.when('POST', '/api/posters/11s').respond(function(){
        Ctrl.postersList[0] = updatedPoster
      });
    }));

    it('should be exist', function() {
      expect(scope).toBeDefined();
      expect(Ctrl).toBeDefined();
      expect(Ctrl.postersList).toBeDefined();

      expect(Ctrl.Rooms).toBeDefined();

      expect(Ctrl.onDropMonitor).toBeDefined();
      expect(Ctrl.eventsUpdate).toBeDefined();
      expect(Ctrl.countPosters).toBeDefined();
      expect(Ctrl.selectionOnRoom).toBeDefined();
      expect(Ctrl.onDropRoom).toBeDefined();
      expect(Ctrl.datepicker).toBeDefined();

      expect(Ctrl.eventMonitor).toBeDefined();
      expect(Ctrl.eventMonitor.left).toBeDefined();
      expect(Ctrl.eventMonitor.right).toBeDefined();

      expect(Ctrl.currentRoom).toBeDefined();
      expect(Ctrl.currentRoom.left).toBeDefined();
      expect(Ctrl.currentRoom.right).toBeDefined();

      expect(Ctrl.sortableOptions).toBeDefined();
      expect(Ctrl.PostersOnRoomWithoutMonitor).toBeDefined();
    });

    describe('function "eventsUpdate"', function() {
//      it('update poster and should called "selectionOnRoom"', function() {
//        var event = Ctrl.postersList[0];
//        event.room = 'testRoom';
//        event.monitor = 'testMonitor';
//        spyOn(Ctrl, 'selectionOnRoom');
//
//        Ctrl.eventsUpdate();
//        expect(Ctrl.postersList[0]).toEqual(event);
//        expect(Ctrl.selectionOnRoom).toHaveBeenCalled();
//      });
//      it('update poster and should return without called "selectionOnRoom"', function() {
//        var event = Ctrl.postersList[0];
//        event.room = 'testRoom';
//        event.monitor = 'testMonitor';
//        spyOn(Ctrl, 'selectionOnRoom');
//
//        Ctrl.eventsUpdate(event, event._id, true);
//        expect(Ctrl.postersList[0]).toEqual(event);
//        expect(Ctrl.selectionOnRoom).not.toHaveBeenCalled();
//      });
    });




    describe('function "selectionOnRoom"', function() {
      it('should return 4 monitors for left room, where index is _id monitors', function() {

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.left.length).toEqual(5);
        expect(Ctrl.eventMonitor.left[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[1].length).toEqual(1);
        expect(Ctrl.eventMonitor.left[2].length).toEqual(1);
        expect(Ctrl.eventMonitor.left[3].length).toEqual(1);
        expect(Ctrl.eventMonitor.left[4].length).toEqual(1);
      });
      it('should return 0 monitors for right room, where index is _id monitors', function() {

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.right.length).toEqual(0);
        expect(Ctrl.eventMonitor.right[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[1]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[2]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[3]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[4]).toBeUndefined();
      });
      it('should return 3 monitors for left room, where second monitor with two posters and index is _id monitors', function() {
        var event = Ctrl.postersList[0];
        event.monitor = 2;

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.left.length).toEqual(5);
        expect(Ctrl.eventMonitor.left[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[1]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[2].length).toEqual(2);
        expect(Ctrl.eventMonitor.left[3].length).toEqual(1);
        expect(Ctrl.eventMonitor.left[4].length).toEqual(1);
      });
      it('should return 1 monitors for right room, where second monitor with posters and index is _id monitors', function() {
        var event = Ctrl.postersList[0];
        event.monitor = 2;
        event.room = 2;

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.right.length).toEqual(3);
        expect(Ctrl.eventMonitor.right[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[1]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[2].length).toEqual(1);

        event.monitor = 1;
        event.room = 1;
      });
      it('changed left room and should return 0 monitors', function() {
        Ctrl.currentRoom.left = Ctrl.Rooms[2];
        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.left.length).toEqual(0);
      });
      it('changed right room and should return 0 monitors', function() {
        Ctrl.currentRoom.right = Ctrl.Rooms[2];
        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.right.length).toEqual(0);
      });
      it('changed right room and should return 5 monitors', function() {
        Ctrl.currentRoom.right = Ctrl.Rooms[0];
        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.right.length).toEqual(5);
        expect(Ctrl.eventMonitor.right[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.right[1].length).toEqual(1);
        expect(Ctrl.eventMonitor.right[2].length).toEqual(1);
        expect(Ctrl.eventMonitor.right[3].length).toEqual(1);
        expect(Ctrl.eventMonitor.right[4].length).toEqual(1);
      });
      it('changed left room and should return 1 monitors, where index is _id monitors', function() {
        var event = Ctrl.postersList[0];
        event.room = 2;
        event.monitor = 2;
        Ctrl.currentRoom.left = Ctrl.Rooms[1];

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.left.length).toEqual(3);
        expect(Ctrl.eventMonitor.left[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[1]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[2].length).toEqual(1);
      });
      it('changed room and should return 1 monitors with two posters, where index is _id monitors', function() {
        var event_1 = Ctrl.postersList[0];
        event_1.room = 2;
        event_1.monitor = 2;
        var event_2 = Ctrl.postersList[1];
        event_2.room = 2;
        event_2.monitor = 2;
        Ctrl.currentRoom.left = Ctrl.Rooms[1];

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.left.length).toEqual(3);
        expect(Ctrl.eventMonitor.left[0]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[1]).toBeUndefined();
        expect(Ctrl.eventMonitor.left[2].length).toEqual(2);
      });
      it('should called "countPosters"', function() {
        spyOn(Ctrl, 'countPosters');

        Ctrl.selectionOnRoom();
        expect(Ctrl.countPosters).toHaveBeenCalled();
      });
    });

    describe('function "onDropMonitor"', function() {
//      var element ={
//          draggable: '<div data-id="11s" data-drag="true">Poster 1</div>'
//        }
//        , event = {
//          target: '<div data-id="1" data-position="right" data-drop="true">Monitor 1</div>'
//        };
//
//      it('should called "eventsUpdate" with 3 params: (Ctrl.postersList[0], 11s, false)', function() {
//        spyOn(Ctrl, 'eventsUpdate');
//
//        Ctrl.onDropMonitor(event, element);
//        expect(Ctrl.eventsUpdate).toHaveBeenCalledWith(Ctrl.postersList[0], '11s', false);
//      });
//
//      it('should called "eventsUpdate" with 3 params: (Ctrl.postersList[0], 11s, true)', function() {
//        var _posters = Ctrl.postersList[0];
//        _posters.monitor = 2;
//
//        event = {
//          target: '<div data-id="2" data-position="left" data-drop="true">Monitor 2</div>'
//        };
//        spyOn(Ctrl, 'eventsUpdate');
//
//        Ctrl.onDropMonitor(event, element);
//        expect(Ctrl.eventsUpdate).toHaveBeenCalledWith(Ctrl.postersList[0], '11s', true);
//      });
//
//      it('should return without called "eventsUpdate"', function() {
//        element ={
//          draggable: '<div data-id="1" data-drag="true">Poster 1</div>'
//        };
//        spyOn(Ctrl, 'eventsUpdate');
//
//        Ctrl.onDropMonitor(event, element);
//        expect(Ctrl.eventsUpdate).not.toHaveBeenCalled();
//      });
    });

    describe('function "onDropRoom"', function() {
//      var element ={
//          draggable: '<div data-id="11s" data-drag="true">Poster 1</div>'
//        }
//        , event = {
//          target: '<div data-id="1" data-position="right" data-drop="true">Room 1</div>'
//        };
//
//      it('should called "eventsUpdate" with 2 params: (Ctrl.postersList[0], 11s)', function() {
//        spyOn(Ctrl, 'eventsUpdate');
//        httpBackend.expectGET('/api/posters/11s');
//        httpBackend.expectPOST('/api/posters/11s', {monitor: -1});
//
//        Ctrl.onDropRoom(event, element)
//        httpBackend.flush();
//        expect(Ctrl.eventsUpdate).toHaveBeenCalled();
//
//      });
//
//      it('should return without called "eventsUpdate"', function() {
//        element ={
//          draggable: '<div data-id="1" data-drag="true">Poster 1</div>'
//        };
//        spyOn(Ctrl, 'eventsUpdate');
//
//        Ctrl.onDropRoom(event, element);
//        expect(Ctrl.eventsUpdate).not.toHaveBeenCalled();
//      });
    });

    describe('function "countPosters"', function() {
      it('should return 0 elements"', function() {
        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor.left).toEqual(0);
        expect(Ctrl.PostersOnRoomWithoutMonitor.right).toEqual(0);
      });
      it('should return 1 element for left room"', function() {
        Ctrl.currentRoom.left = Ctrl.Rooms[0];
        var event = Ctrl.postersList[0];
        event.monitor = -1;
        event.room = 1;

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor.left).toEqual(1);
      });
      it('should return 1 element for right room"', function() {
        var event = Ctrl.postersList[0];
        event.monitor = -1;
        event.room = 2;

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor.right).toEqual(1);
      });
      it('changed left room and should return 0 element"', function() {
        var event = Ctrl.postersList[0];
        event.monitor = -1;
        event.room = 1;
        Ctrl.currentRoom.left = Ctrl.Rooms[1];

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor.left).toEqual(0);
      });
      it('changed left room and should return 1 element"', function() {
        var event = Ctrl.postersList[0];
        event.room = 2;
        event.monitor = -1;
        Ctrl.currentRoom.left = Ctrl.Rooms[1];
        Ctrl.currentRoom.right = Ctrl.Rooms[2];

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor.left).toEqual(1);
        expect(Ctrl.PostersOnRoomWithoutMonitor.right).toEqual(0);
      });
    });
  });
});
