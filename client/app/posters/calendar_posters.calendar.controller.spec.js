'use strict';

ddescribe('posters.calendar.controller', function() {
  describe('Controller: PostersCalendarCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope
      ,httpBackend
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
      }];

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$controller_, $rootScope, $httpBackend) {
      scope = $rootScope.$new();
      httpBackend = $httpBackend
      Ctrl = _$controller_('PostersCalendarCtrl', {
        $scope: scope
        ,preLoadPosters: {result: preLoadPosters}
      });
      httpBackend.when('GET', '/api/posters/11s').respond(preLoadPosters[0]);
    }));

    it('should be exist', function() {
      expect(scope).toBeDefined();
      expect(Ctrl).toBeDefined();
      expect(Ctrl.postersList).toBeDefined();
      expect(Ctrl.calendarDrop).toBeDefined();
      expect(Ctrl.currentEvents).toBeDefined();
      expect(Ctrl.eventsReload).toBeDefined();
      expect(Ctrl.getPosterById).toBeDefined();
      expect(Ctrl.updatePoster).toBeDefined();
      expect(Ctrl.uiConfig).toBeDefined();
    });

    it('should be exist the contents of the object "uiConfig"', function() {
      expect(Ctrl.uiConfig.calendar).toBeDefined();
      expect(Ctrl.uiConfig.calendar.droppable).toBeDefined();
      expect(Ctrl.uiConfig.calendar.drop).toBeDefined();
      expect(Ctrl.uiConfig.calendar.eventDrop).toBeDefined();
    });

    it('function "eventsReload" should be executed', function() {
      Ctrl.eventsReload();
      expect(Ctrl.currentEvents[0].start).toEqual(new Date(Ctrl.postersList[0].startDate));
      expect(Ctrl.eventSources.length).toEqual(1);
    });

    describe('function "addEvent"', function() {
      var event;
      beforeEach(function() {
        event = Ctrl.currentEvents[0];
        event.allDay = true;
        event.start = 'Mon Apr 06 2015 00:00:00 GMT+0300 (FET)';
        Ctrl.currentEvents = [];
        spyOn(Ctrl, 'updatePoster');
        Ctrl.addEvent(event);
      });

      afterEach(function() {
        Ctrl.currentEvents = [];
      });

      it('should be executed', function() {
        expect(Ctrl.currentEvents.length).toEqual(1);
        expect(Ctrl.currentEvents[0]._id).toEqual(event._id);
        expect(Ctrl.currentEvents[0].start).toEqual(event.start);
        expect(Ctrl.currentEvents[0].title).toEqual(event.title);
        expect(Ctrl.currentEvents[0].allDay).toEqual(event.allDay);
      })

      it('should be called "updatePoster"', function() {
        expect(Ctrl.updatePoster).toHaveBeenCalledWith(event._id, event.start);
      });
    });



    describe('function "calendarDrop"', function() {
      var event = {
        target: '<div data-id="11s" data-position="right" data-drop="true"></div>'
      }
        , date = 'Mon Apr 06 2015 00:00:00 GMT+0300 (FET)'
        , allDay = true;

      //error full calendar
//      it('should be called "addEvent" with one params (Ctrl.postersList[0])', function() {
//        var _poster = Ctrl.postersList[0];
//        spyOn(Ctrl, 'addEvent');
//        Ctrl.calendarDrop(date, allDay, event);
//
//        expect(Ctrl.addEvent).toHaveBeenCalledWith(_poster);
//      });
      it('should be called "addEvent" with one params (Ctrl.postersList[0])', function() {
        var _poster = Ctrl.postersList[0];
        spyOn(Ctrl, 'addEvent');
        Ctrl.eventSources = []
        Ctrl.calendarDrop(date, allDay, event);

        expect(Ctrl.addEvent).toHaveBeenCalledWith(_poster);
      });
      it('should return without called "addEvent"', function() {
        event ={
          target: '<div data-id="1" data-position="right" data-drop="true"></div>'
        };
        spyOn(Ctrl, 'addEvent');

        Ctrl.calendarDrop(date, allDay, event);
        expect(Ctrl.addEvent).not.toHaveBeenCalled();
      });
    });

//    it('function "eventsReload" should be executed', function() {
////      httpBackend.expectGET('/api/posters/11s');
//      httpBackend.flush();
//      console.log('=============', Ctrl.eventSources)
//      var el = Ctrl.getPosterById('11s');
////      var el = Ctrl.getPosterById('11s');
//      console.log('=============', Ctrl.eventSources, el)
////      expect(Ctrl.eventSources.length).toEqual(1);
//    });
  });
});
