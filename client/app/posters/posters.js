
  'use strict';

  angular.module('newsApp')

    .config(Config);

  Config.$inject = ['$stateProvider'];
  function Config($stateProvider) {
    var states = {

      posters: {
        list : {
          url: '/posters',
          views: {
            '': {
              templateUrl: 'app/posters/list_posters.html'
            },
            'leftPane@posters': {
              templateUrl: 'app/posters/list_view-list.html',
              controller: 'PostersListCtrl'
            }
          },
          authenticate: true
        },
        add: {
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_form.html',
              controller: 'PostersFormCtrl'
            }
          },
          authenticate: true
        },
        update: {
          url: '/:id/edit',
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_form.html',
              controller: 'PostersFormCtrl'
            }
          },
          authenticate: true
        },
        details: {
          url: '/:id',
          views: {
            'rightPane@posters': {
              templateUrl: 'app/posters/list_view-details.html',
              controller: 'PostersDetailsCtrl'
            }
          },
          authenticate: true
        }
      },
      //// Calendar Screen
      calendar: {
        url: '/calendar',
        templateUrl: 'app/posters/calendar_calendar.html',
        controller: 'PostersCalendarCtrl',
        controllerAs: 'postersCalendar',
        resolve: {
          preLoadPosters: preLoadPosters
        },
        authenticate: true
      },
      //// Rooms / Monitors Screen
      monitors: {
        url: '/monitors',
        templateUrl: 'app/posters/monitors_monitors.html',
        controller: 'PostersMonitorsCtrl',
        controllerAs: 'postersMonitors',
        resolve: {
          preLoadPosters: preLoadPosters,
          preLoadRooms: preLoadRooms
        },
        authenticate: true
      },
      //// Rooms Split Screen
      roomsSplit: {
        url: '/rooms-split',
        templateUrl: 'app/posters/rooms-split_rooms-split.html',
        controller: 'PostersRoomsSplitCtrl',
        controllerAs: 'postersRoomsSplit',
        resolve: {
          preLoadPosters: preLoadPosters,
          preLoadRooms: preLoadRooms
        },
        authenticate: true
      },
      //// Upload csv file screen
      uploadCsv: {
        url: '/upload-csv',
        templateUrl: 'app/posters/upload-csv.html',
        controller: 'UploadCsvCtrl',
        controllerAs: 'uploadCsv',
        authenticate: true
      }
    };

    ////resolve function
    preLoadPosters.$inject = ['Posters'];
    function preLoadPosters(Posters){
      return Posters.query().$promise.then(function(response) {
        return response
      })

    }

    preLoadRooms.$inject = ['Rooms'];
    function preLoadRooms(Rooms){
      return Rooms.query().$promise.then(function(response) {
        return response
      })

    }

    $stateProvider
      .state('posters', states.posters.list)
      .state('posters.add', states.posters.add)
      .state('posters.update', states.posters.update)
      .state('posters.details', states.posters.details)

      .state('calendar', states.calendar)
      .state('monitors', states.monitors)
      .state('rooms-split', states.roomsSplit)
      .state('upload-csv', states.uploadCsv)
  }
