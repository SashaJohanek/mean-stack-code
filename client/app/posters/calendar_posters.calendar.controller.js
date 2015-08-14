'use strict';

angular.module('newsApp')
  .controller('PostersCalendarCtrl', ['$scope', 'Posters', 'preLoadPosters',
    function ($scope, Posters, preLoadPosters) {

      var self = this;
      self.postersList =preLoadPosters.result;
      self.assigned = false;

      self.addEvent = addEvent;
      self.currentEventsLog = currentEventsLog;
      self.calendarDrop = calendarDrop;
      self.eventsReload = eventsReload;
      self.getPosterById = getPosterById;
      self.updatePoster = updatePoster;
      self.currentEvents = [];
      self.filteringByAssigned = filteringByAssigned;

      activate();

      function activate() {
        self.eventsReload()
      }

      /* colendar config object */
      self.uiConfig = {
        calendar: {
          height: 450,
          editable: true,
          header: {
            left: 'month,agendaWeek,agendaDay',
            center: 'title',
            right: 'today prev,next'
          },
          droppable: true,
          drop: function (date, allDay, event) {
            return self.calendarDrop(date, allDay, event)
          },
          eventClick: function () {
          },
          eventDrop: function (e) {
            self.updatePoster(e._id, e._start)

          },
          eventResize: function () {
          },
          updateEvent: function () {
          }
        }
      };

      /* add custom event*/
      function addEvent(e) {
        var event = {
          _id: e._id,
          title: e.title,
          allDay: e.allDay,
          start: e.start
        };
        self.currentEvents.push(event);
        self.updatePoster(e._id, e.start)
      }

      function calendarDrop(date, allDay, event) {
        // this function is called when something is dropped
        var _id = angular.element(event.target).data('id')
          , el = _.findWhere(self.postersList, {_id: _id});

        // if something went wrong, abort
        if (!el) return;

        if (el.start != date) {
          el.startDate = new Date(date).getTime();
        }
        el.start = date;
        el.allDay = allDay;
        if ((_.where(self.eventSources[0], {_id: _id})).length) {
          self.currentEvents.splice(self.currentEvents.indexOf(_.findWhere(self.currentEvents , {_id: _id})), 1);
          angular.element('#calendar').fullCalendar('removeEvents', _id);
        }
        self.addEvent(el);
      }

      function eventsReload() {
        self.postersList.forEach(function (item) {
          item.start = new Date(item.startDate);
          self.currentEvents.push(item)
        });
        self.eventSources = [self.currentEvents];
      }

      function getPosterById(_id) {
        return Posters.get({id: _id}).$promise.then(function(response) {
          return response
        })
      }

      function updatePoster(_id, _date) {
        self.getPosterById(_id).then(function(response) {
          var body = response;
          body.startDate = (new Date(_date)).getTime();
          body.$save();
        });
        self.eventSources = [self.currentEvents];
      }

      function filteringByAssigned(poster) {
        var filter = self.assigned

        var hasRoom    = false;
        var hasMonitor = false;

        if (poster.room){
          hasRoom = true;
        }

        if (poster.monitor && poster.monitor > -1){
          hasMonitor = true;
        }

        return ((hasRoom && hasMonitor) === filter)

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

      //use manual search because standart angular search calls: RangeError: Maximum call stack size exceeded
      //it happends because add field "start"
      $scope.search = function (row) {
        return (angular.lowercase(row.title).indexOf($scope.query || '') !== -1 ||
            angular.lowercase(row.presentationType).indexOf($scope.query || '') !== -1 ||
            angular.lowercase(row.code).indexOf($scope.query || '') !== -1);
      };

      function currentEventsLog() {
        console.log('currentEventsLog', Posters.query());
      }

    }]);

