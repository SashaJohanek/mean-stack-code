'use strict';

describe('offers.controller', function() {
  describe('Controller: OffersListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('OffersListCtrl', {
        $scope: scope
      });
    }));

    it('should have a offers model', function() {
      expect(scope.data.records).toBeDefined();
    });
  });

  describe('Controller: OffersAddFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('OffersAddFormCtrl', {
        $scope: scope
      });
    }));


    it('should have a model to hold the list of available items', function() {
      expect(scope.data.items).toBeDefined();
    });

    it('should have a model to hold the added prices', function() {
      expect(scope.data.prices).toBeDefined();
    });

    it('should have models', function() {
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

  describe('Controller: OffersUpdateFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('OffersUpdateFormCtrl', {
        $scope: scope
      });
    }));

    it('should have a model to hold the list of available items', function() {
      expect(scope.data.items).toBeDefined();
    });


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

  describe('Controller: OffersDetailsCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('OffersDetailsCtrl', {
        $scope: scope
      });
    }));

    it('should have model to hold the updated offer details', function() {
      expect(scope.data.model).toBeDefined();
    });
  });

  describe('Controller: OffersItemCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function($controller, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = $controller('OffersItemCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(Ctrl).toBeDefined();
      expect(scope.deleteOffer).toBeDefined();
    });
  });

});