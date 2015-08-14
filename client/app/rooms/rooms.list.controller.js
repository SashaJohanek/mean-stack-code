'use strict';

angular.module('newsApp')
  .controller('RoomsListCtrl', ['$scope', '$rootScope', 'paginator', 'Rooms',
    function ($scope, $rootScope, paginator,  Rooms) {

      var firstPage = 1; // get the 1st page

      $scope.data = {
        records : []
      }

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
      Rooms.query({page :firstPage}).$promise.then(function(response) {
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
        Rooms.query({page : paginator.getPage() - 1}).$promise.then(function(response) {
          var body = response;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }

      /**
       * Browse the next page of records
       */
      $scope.nextPage = function() {

        // fetch the records
        Rooms.query({page : paginator.getPage() + 1}).$promise.then(function(response) {
          var body = response;
          $scope.data.records = body.result;

          // set the pager
          paginator.setPage(body.page);
          paginator.setPrevious(body.page === 1);
          paginator.setNext(body.page === body.num_pages);
        });
      }


    }]);
