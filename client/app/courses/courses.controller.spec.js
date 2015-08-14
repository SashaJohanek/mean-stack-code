'use strict';

describe('courses.controller', function() {
  describe('Controller: CoursesListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CoursesListCtrl', {
        $scope: scope
      });
    }));

    it('should have a courses model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });


  describe('Controller: CoursesAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CoursesAddFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a courses model', function() {
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

  describe('Controller: CoursesUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CoursesUpdateFormCtrl', {
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

  describe('Controller: CoursesDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CoursesDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have models', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: CoursesItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('CoursesItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteItem).toBeDefined();
    });
  });

});
