'use strict';

var METHOD_TAKEAWAY    = 'METHOD_TAKEAWAY';
var METHOD_DELIVERY    = 'METHOD_DELIVERY';

var STATUS_NEW_UNREAD  = 'STATUS_NEW_UNREAD';
var STATUS_NEW         = 'STATUS_NEW';
var STATUS_IN_PROGRESS = 'STATUS_IN_PROGRESS';
var STATUS_SHIPPED     = 'STATUS_SHIPPED';
var STATUS_DELIVERED   = 'STATUS_DELIVERED';
var STATUS_CANCELED    = 'STATUS_CANCELED';

angular.module('newsApp')
  .filter('statusDescriptor', [
    function() {
      return function(input) {
        var map = {};

        map[STATUS_NEW_UNREAD]  = 'New';
        map[STATUS_NEW]         = 'New';
        map[STATUS_IN_PROGRESS] = 'In progress';
        map[STATUS_SHIPPED]     = 'Shipped';
        map[STATUS_DELIVERED]   = 'Completed';
        map[STATUS_CANCELED]    = 'Canceled';

        return map[input];
      }
    }

  ]);

angular.module('newsApp')
  .controller('OrdersPreviewModalInstanceCtrl', [
    '$scope', '$modalInstance', '$log', 'order',
    function($scope, $modalInstance, $log, order) {

      $scope.order = order;

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);

angular.module('newsApp')
  .filter('methodDescriptor', [
    function() {
      return function(input) {
        var map = {};

        map[METHOD_TAKEAWAY] = 'Take away';
        map[METHOD_DELIVERY] = 'Delivery';

        return map[input];
      }
    }

  ]);

angular.module('newsApp')
  .controller('OrdersListCtrl', [ '$scope', '$rootScope', '$location', '$state', '$modal', '$log', 'paginator', 'Orders',
  function ($scope, $rootScope, $location, $state, $modal, $log, paginator, Orders) {

    var firstPage = 1; // get the 1st page

    $scope.data = {
      orders: []
    };

    // pagination
    $scope.pagination = {
      next: false,
      previous: false,
      page: 1,
      page_size: 0,
      total: 0,
      num_pages: 0
    };

    $scope.paginator = paginator;

    // fetch the list
    Orders.get(firstPage).then(function(response) {
      var body = response.data;

      for (var i in body.result){
        var order = body.result[i];
        order.preparationTime = function(){
          var sum = 0;
          for(var i in this.items){
            sum = sum + this.items[i].preparationTime;
          }
          return sum;
        };
      }

      $scope.data.orders = body.result;

      // set the pager
      paginator.setPage(body.page);
      paginator.setPages(body.num_pages);
      paginator.setPrevious(body.page === firstPage);
      paginator.setNext(body.page === body.num_pages);
    });

    /**
     * Browse the previous page of list
     */
    $scope.previousPage = function() {
      // fetch the list
      Orders.get(paginator.getPage() - 1).then(function(response) {
        var body = response.data;
        $scope.data.orders = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPages(body.num_pages);
        paginator.setPrevious(body.page === firstPage);
        paginator.setNext(body.page === body.num_pages);
      });
    }

    /**
     * Browse the next page of list
     */
    $scope.nextPage = function() {

      // fetch the list
      Orders.get(paginator.getPage() + 1).then(function(response) {
        var body = response.data;
        $scope.data.orders = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPages(body.num_pages);
        paginator.setPrevious(body.page === firstPage);
        paginator.setNext(body.page === body.num_pages);
      });
    }

    // listen to hide list update event
    var listUpdatedListener = $rootScope.$on('list_updated', function() {
      Orders.get($scope.pagination.page).then(function(response) {
        var body = response.data;
        $scope.data.orders = body.result;

        // set the pager
        paginator.setPage(body.page);
        paginator.setPages(body.num_pages);
        paginator.setPrevious(body.page === firstPage);
        paginator.setNext(body.page === body.num_pages);
      });
    });

    function update(index){
      Orders.update( $scope.data.orders[index]._id,  $scope.data.orders[index]).then(function onSuccess(response) {
        console.log('response: %o', response);

        // notify the listener when the offer is added
        $scope.$emit('list_updated');

        $.notify("The order status has been updated.", {"status":"info"} || {});

      }, function onError(response) {
        $log.error('response', response);
      });
    }

    $scope.preview = function(index) {

      var modalInstance = $modal.open({
        templateUrl: 'app/orders/modal-preview.html',
        controller: 'OrdersPreviewModalInstanceCtrl',
        resolve: {
          order: function(){
            return $scope.data.orders[index];
          }
        }
      });

      modalInstance.result.then(
        function() {
          // $location.path('/orders/' + $scope.data.orders[index]._id + '?ref=print');
          $state.go('orders.details', {'id': $scope.data.orders[index]._id, 'ref': 'back'});
        },
        function() {
          $log.info('Logout is aborted.');
        });

    };

    $scope.open = function(index){
      console.log('Mark order as completed: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_NEW;

      update(index);
    }

    $scope.complete = function(index){
      console.log('Mark order as completed: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_DELIVERED;

      update(index);
    }

    $scope.cancel = function(index){
      console.log('Mark order as canceled: %o', $scope.data.orders[index]);
      $scope.data.orders[index].status = STATUS_CANCELED;

      update(index);
    }

    // unregister the listener to avoid memory leak
    $scope.$on('$destroy', listUpdatedListener);

    $(window).trigger('resize');
  }]);

angular.module('newsApp')
  .controller('OrdersDetailsCtrl', ['$scope', '$rootScope', '$state', '$stateParams', '$log',
    'Orders',
    function($scope, $rootScope, $state, $stateParams, $log, Orders) {
      // hold the details
      $scope.order = {};

      // hold ui related info
      $scope.ui = {}

      var ref;
      switch ($stateParams.ref) {
        case 'print':
          ref= 'back'
          break;
        case 'back':
          ref= 'back';
          break;
        default:
          ref='';
      }
      $scope.ui.ref = ref;

      function print(){
        $(document).ready(function(){

          var interval = setTimeout(function(){
            var a = window.print();
            $state.go('orders');
          },500);

        });
      }

      function update(){
        Orders.update($scope.order._id, $scope.order).then(function onSuccess(response) {
          console.log('response: %o', response);

          var body = response.data;
          $scope.order = body.result;

          $.notify("The order status has been updated.", {"status":"info"} || {});

        }, function onError(response) {
          $log.error('response', response);
        });
      }

      // fetch single data
      Orders.findOne($stateParams.id).then(function(response) {
        var body = response.data;

        // Calculate taxes and sub total
        var items = body.result.items
        var tax = {};

        // v = n * (1 + r)
        //
        // n = v / (1 + r)
        //
        // t = v - n
        // t = v - (v / (1 + r))
        // t = v * (1 - (1/(1 + r )))

        var taxTotal = 0;
        var grandTotal = 0;
        for (var i in items){
          var t = items[i].tax;
          var unitPrice = items[i].unitPrice;
          var q = items[i].quantity;
          var v = unitPrice * (1 - 1 / (1 + items[i].tax.percentage));
          if (tax[t.percentage]){
            tax[t.percentage] = tax[t.percentage] + v * q
          }else{
            tax[t.percentage] = v * q
          }

          taxTotal = taxTotal + v
          grandTotal = grandTotal + unitPrice * q
        }

        var taxarr = [];
        for(var x in tax){
          taxarr.push({percentage: x, value: tax[x]});
        }

        $scope.order = body.result;
        $scope.order.tax = taxarr;
        $scope.order.taxTotal = taxTotal;
        $scope.order.netTotal = grandTotal - taxTotal;
        $scope.order.grandTotal = grandTotal;

        // The first time an order is opened we
        // should change its status from unread to new
        if ($scope.order.status === STATUS_NEW_UNREAD){
          $scope.order.status = STATUS_NEW;

          update();
        }

        if ($stateParams.ref === 'print'){
          print();
        }

      });

      $scope.open = function(){
        console.log('Mark order as open: %o', $scope.order);
        $scope.order.status = STATUS_NEW;

        update();
      }

      $scope.complete = function(){
        console.log('Mark order as completed: %o', $scope.order);
        $scope.order.status = STATUS_DELIVERED;

        update();
      }

      $scope.cancel = function(){
        console.log('Mark order as canceled: %o', $scope.order);
        $scope.order.status = STATUS_CANCELED;

        update();
      }

    }
  ]);
