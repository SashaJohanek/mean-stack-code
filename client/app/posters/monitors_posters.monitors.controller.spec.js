'use strict';

ddescribe('posters.monitors.controller', function() {
  describe('Controller: PostersMonitorsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
        scope
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
        }];

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$controller_, $rootScope, $compile) {
      scope = $rootScope.$new();
      Ctrl = _$controller_('PostersMonitorsCtrl', {
        $scope: scope
        ,preLoadPosters: {result: preLoadPosters}
        ,preLoadRooms: {result: preLoadRooms}
      });
    }));

    it('should be exist', function() {
      expect(scope).toBeDefined();
      expect(Ctrl).toBeDefined();
      expect(Ctrl.postersList).toBeDefined();
      expect(Ctrl.View).toBeDefined();
      expect(Ctrl.Add).toBeDefined();

      expect(Ctrl.Rooms).toBeDefined();

      expect(Ctrl.onDropMonitor).toBeDefined();
      expect(Ctrl.eventsUpdate).toBeDefined();
      expect(Ctrl.countPosters).toBeDefined();
      expect(Ctrl.selectionOnRoom).toBeDefined();
      expect(Ctrl.onDropRoom).toBeDefined();
      expect(Ctrl.datepicker).toBeDefined();

      expect(Ctrl.eventMonitor).toBeDefined();
      expect(Ctrl.currentRoom).toBeDefined();
      expect(Ctrl.sortableOptions).toBeDefined();
    });

    it('function "View"', function() {
      Ctrl.View(Ctrl.postersList[0]._id);
      expect(Ctrl.posterInf).toBeDefined();
      expect(Ctrl.posterInf).toEqual(Ctrl.postersList[0]);
      expect(scope.BtnView).toBeTruthy();
      expect(scope.BtnUpdate).toBeFalsy();
    });

    it('function "Add"', function() {
      var _el = {
        _id: '',
        title: '',
        body: '',
        room: '',
        monitor: '',
        startDate: ''
      };

      Ctrl.Add();
      expect(Ctrl.posterInf).toEqual(_el);
      expect(scope.BtnView).toBeFalsy();
      expect(scope.BtnUpdate).toBeFalsy();
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
      it('should return 4 monitors, where index is _id monitors', function() {
        Ctrl.selectionOnRoom();

        expect(Ctrl.eventMonitor.length).toEqual(5);
        expect(Ctrl.eventMonitor[0]).toBeUndefined();
        expect(Ctrl.eventMonitor[1].length).toEqual(1);
        expect(Ctrl.eventMonitor[2].length).toEqual(1);
        expect(Ctrl.eventMonitor[3].length).toEqual(1);
        expect(Ctrl.eventMonitor[4].length).toEqual(1);
      });
      it('should return 3 monitors, where second monitor with two posters and index is _id monitors', function() {
        var event = Ctrl.postersList[0];
        event.monitor = 2;

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.length).toEqual(5);
        expect(Ctrl.eventMonitor[0]).toBeUndefined();
        expect(Ctrl.eventMonitor[1]).toBeUndefined();
        expect(Ctrl.eventMonitor[2].length).toEqual(2);
        expect(Ctrl.eventMonitor[3].length).toEqual(1);
        expect(Ctrl.eventMonitor[4].length).toEqual(1);
      });
      it('changed room and should return 0 monitors', function() {
        Ctrl.currentRoom._id = 2;
        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.length).toEqual(0);
      });
      it('changed room and should return 1 monitors, where index is _id monitors', function() {
        var event = Ctrl.postersList[0];
        event.room = 2;
        event.monitor = 2;
        Ctrl.currentRoom._id = 2;

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.length).toEqual(3);
        expect(Ctrl.eventMonitor[0]).toBeUndefined();
        expect(Ctrl.eventMonitor[1]).toBeUndefined();
        expect(Ctrl.eventMonitor[2].length).toEqual(1);
      });
      it('changed room and should return 1 monitors with two posters, where index is _id monitors', function() {
        var event_1 = Ctrl.postersList[0];
        event_1.room = 2;
        event_1.monitor = 2;
        var event_2 = Ctrl.postersList[1];
        event_2.room = 2;
        event_2.monitor = 2;
        Ctrl.currentRoom._id = 2;

        Ctrl.selectionOnRoom();
        expect(Ctrl.eventMonitor.length).toEqual(3);
        expect(Ctrl.eventMonitor[0]).toBeUndefined();
        expect(Ctrl.eventMonitor[1]).toBeUndefined();
        expect(Ctrl.eventMonitor[2].length).toEqual(2);
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
//          target: '<div data-id="2" data-drop="true">Monitor 2</div>'
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
//
//        Ctrl.onDropRoom(event, element);
//        expect(Ctrl.eventsUpdate).toHaveBeenCalledWith(Ctrl.postersList[0], '11s');
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
    })


    describe('function "countPosters"', function() {
      it('should return 0 elements"', function() {
        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor).toEqual(0);
      });
      it('should return 1 element"', function() {
        var event = Ctrl.postersList[0];
        event.monitor = -1;

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor).toEqual(1);
        event.monitor = 1;
      });
      it('changed room and should return 0 element"', function() {
        Ctrl.currentRoom._id = 2;
        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor).toEqual(0);
      });
      it('changed room and should return 1 element"', function() {
        var event = Ctrl.postersList[0];
        event.room = 2;
        event.monitor = -1;
        Ctrl.currentRoom._id = 2;

        Ctrl.countPosters();
        expect(Ctrl.PostersOnRoomWithoutMonitor).toEqual(1);
      });
    });
  });
});
