'use strict';
ddescribe('posters.form.controller', function() {
  describe('Controller: PostersFormCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl
        , scope
        , httpBackend
        , Posters
        , _data = {
          _id:"11s",
          title: "Poster 1",
          body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi tristique aliquam scelerisque.",
          startDate: 1442990700000, // date/time to miliseconds
          room: 1,
          monitor: 1
        };

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$controller_, $rootScope, $httpBackend, _Posters_) {
      scope = $rootScope.$new();
      Posters = _Posters_
      httpBackend = $httpBackend;
      httpBackend.when('GET', '/api/posters/11s').respond({data: _data});
      httpBackend.when('GET', '/api/posters').respond();
      httpBackend.when('GET', '/assets/languages/en.json').respond('');
      Ctrl = _$controller_('PostersFormCtrl', {
        $scope: scope
      });

    }));

    it('should be exist', function() {
      expect(scope).toBeDefined();
      expect(Ctrl).toBeDefined();

      expect(scope.data).toBeDefined();
      expect(scope.data.model).toBeDefined();

      expect(scope.selects).toBeDefined();
      expect(scope.selects.monitor).toBeDefined();
      expect(scope.selects.room).toBeDefined();
      expect(scope.selects.rooms).toBeDefined();
      expect(scope.roomId).toBeDefined();

      expect(scope.ui).toBeDefined();
      expect(scope.ui.progress).toBeDefined();
      expect(scope.ui.inProgress).toBeDefined();

      expect(scope.today).toBeDefined();
      expect(scope.clear).toBeDefined();
      expect(scope.open).toBeDefined();
    });


  })
})