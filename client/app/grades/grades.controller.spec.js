'use strict';

describe('grades.controller', function() {
  describe('Controller: GradesListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GradesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a grades model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: GradesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GradesAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a grades model', function() {
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

  describe('Controller: GradesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GradesUpdateFormCtrl', {
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

  describe('Controller: GradesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GradesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: GradesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('GradesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteItem).toBeDefined();
    });
  });

});
