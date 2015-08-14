'use strict';

describe('items.controller', function() {
  describe('Controller: ItemsListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ItemsListCtrl', {
        $scope: scope
      });
    }));

    it('should have a model to hold the list', function() {
      expect(scope.data.records).toBeDefined();
    });
  });

  describe('Controller: ItemsAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ItemsAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a items model', function() {
      expect(scope.data.file).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.save).toBeDefined();

      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: ItemsUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ItemsUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.file).toBeDefined();

      expect(scope.trashbin).toBeDefined();

      expect(scope.data).toBeDefined();
      expect(scope.data.uploadedImages).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.update).toBeDefined();

      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: ItemsDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ItemsDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: ItemsItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('ItemsItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteItem).toBeDefined();
    });
  });

});