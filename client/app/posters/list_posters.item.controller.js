'use strict'

angular.module('newsApp')
  .controller('PostersItemCtrl', ['$scope', 'modalDeleteItem',
    'Posters', '$state',
    function($scope,  modalDeleteItem, Posters, $state) {

      /**
       * Delete item from the list
       */
      $scope.deleteItem = function(record) {
        modalDeleteItem.open(function() {
          Posters.delete({id : record._id}).$promise.then(function onSuccess(response) {
            // reload the list view
            $state.transitionTo('posters', {}, {
              reload: true
            });
          }, function onError(response) {
            console.log('An error occured while deleting record ', response);
          });
        });
      };
    }
  ]);
