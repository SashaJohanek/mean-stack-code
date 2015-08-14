'use strict';

angular.module('newsApp')
    .controller('RoomsItemCtrl', ['$scope', 'modalDeleteItem',
      'Rooms', '$state',
      function($scope,  modalDeleteItem, Rooms, $state) {

        /**
         * Delete item from the list
         */
        $scope.deleteItem = function(record) {
          modalDeleteItem.open(function() {
            Rooms.delete({id : record._id}).$promise.then(function onSuccess(response) {
              // reload the list view
              $state.transitionTo('rooms', {}, {
                reload: true
              });
            }, function onError(response) {
              console.log('An error occured while deleting record ', response);
            });
          });
        };
      }
    ]);