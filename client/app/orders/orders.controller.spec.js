'use strict';

describe('Controller: OrdersListCtrl', function () {

  // load the controller's module
  beforeEach(module('newsApp'));

  var Ctrl, scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    Ctrl = $controller('OrdersListCtrl', {
      $scope: scope
    });
  }));

  it('should have a offers model', function() {
    expect(scope.data.orders).toBeDefined();
  });

});
