'use strict';

describe('categories.controller', function() {
  describe('Controller: CategoriesListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CategoriesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a categories model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: CategoriesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CategoriesAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a categories model', function() {
      expect(scope.data).toBeDefined();

      expect(scope.data.model).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.onFileSelect).toBeDefined();
      expect(scope.save).toBeDefined();

      expect(scope.deleteImage).toBeDefined();
    });
  });

  describe('Controller: CategoriesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CategoriesUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {

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

  describe('Controller: CategoriesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CategoriesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: CategoriesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CategoriesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteCategory).toBeDefined();
    });
  });

});