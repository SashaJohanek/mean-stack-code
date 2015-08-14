'use strict';

angular.module('newsApp')
  .controller('PostersListCtrl', ['$scope', '$rootScope', 'paginator', 'Posters',
    function ($scope, $rootScope, paginator,  Posters) {
      var firstPage = 1; // get the 1st page

      $scope.data = {
        records : []
      };
      $scope.assigned = false;
      $scope.selectedPoster = {}

      // pagination
      $scope.pagination = {
        next: false,
        previous: false,
        page: 0,
        page_size: 0,
        total: 0,
        num_pages: 0
      };

      $scope.paginator = paginator;

      // fetch the records
      Posters.query({page :firstPage}).$promise.then(function(response) {
        var body = response;
        $scope.data.records = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPrevious(body.page === 1);
        paginator.setNext(body.page === body.num_pages);
      });

      /**
       * Browse the previous page of records
       */
      $scope.previousPage = function() {
        // fetch the pages
        Posters.query({page : paginator.getPage() - 1}).$promise.then(function(response) {
          var body = response;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {

        // fetch the records
        Posters.query({page : paginator.getPage() + 1}).$promise.then(function(response) {
          var body = response;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      };

      $scope.filteringByAssigned = function(poster) {
        var filter = $scope.assigned

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
      };
    }

  ]);
