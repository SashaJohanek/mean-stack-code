'use strict';

angular.module('newsApp')
  .controller('AdminDeleteModalInstanceCtrl', [
    '$scope', '$modalInstance', '$log', 'user',
    function($scope, $modalInstance, $log, user) {

      $scope.user = user;

      $scope.ok = function() {
        $modalInstance.close();
      };

      $scope.cancel = function() {
        $modalInstance.dismiss('cancel');
      };

    }
  ]);


angular.module('newsApp')
  .controller('AdminCtrl', function($scope, $http, $log, $modal, Auth, User) {

    // Use the User $resource to fetch all users
    $scope.users = User.query();

    $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
    $scope.format = $scope.formats[2];

    $scope.today = function() {
      $scope.dt = new Date();
    };
    $scope.today();

    // Disable weekend selection
    $scope.disabled = function(date, mode) {
      return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
    };

    $scope.toggleMin = function() {
      $scope.minDate = $scope.minDate ? null : new Date();
    };
    $scope.toggleMin();

    $scope.opened = [];

    $scope.open = function(index, $event) {
      $event.preventDefault();
      $event.stopPropagation();

      $scope.opened[index] = true;
    };

    $scope.dateOptions = {
      formatYear: 'yy',
      startingDay: 1
    };

    // $scope.delete = function(user) {
    //   User.remove({
    //     id: user._id
    //   });
    //   angular.forEach($scope.users, function(u, i) {
    //     if (u === user) {
    //       $scope.users.splice(i, 1);
    //     }
    //   });
    // };

    $scope.isExpired = function(user){

      // Admin account never expire
      if (user.role === 'admin'){
        return false;
      }

      var expiration = user.expiration;
      var now = Date.now();

      console.log("User %o, Now %i, expiration %i", user, now, expiration)

      return now > expiration;

    }


    /**
     * Delete item from the list
     */
    $scope.delete = function(user) {

      var modalInstance = $modal.open({
        templateUrl: 'app/admin/modal-delete.html',
        controller: 'AdminDeleteModalInstanceCtrl',
        resolve: {
          user: function() {
            return user;
          }
        }
      });

      modalInstance.result.then(
        function() {
          User.remove({
            id: user._id
          });
          angular.forEach($scope.users, function(u, i) {
            if (u === user) {
              $scope.users.splice(i, 1);
            }
          });
        },
        function() {
          $log.info('Delete user is aborted.');
        });

    };

    $scope.feature = function(user){
      console.log("User set as featured is requested.");

      // Admin should always be active
      if (user.role === 'admin'){
        if (!user.featured){
          alert("You can set as featured this user!");
        }
        user.featured = false;
        return;
      }

      User.feature({
        _id: user._id,
        featured: user.featured
      });
    }

    $scope.expiration = function(user){
      console.log("User expiration set is requested.");

      // Admin should always be active
      if (user.role === 'admin'){
          alert("You can set the expiration date of this user!");
          return;
      }

      console.log("expiration date: %s", user.expiration)
      // User.activate({
      //   _id: user._id,
      //   activate: user.active
      // });

      User.expire({
        _id: user._id,
        expiration: user.expiration.getTime()
      });
    }

    $(window).trigger('resize');

  });
