'use strict';

describe('posters.list.controller', function() {
  describe('Controller: PostersListCtrl', function() {

    // load the controller's module
    beforeEach(module('newsApp'));

    var Ctrl,
      scope;

    // Initialize the controller and a mock scope
    beforeEach(inject(function(_$controller_, $rootScope) {
      scope = $rootScope.$new();
      Ctrl = _$controller_('PostersListCtrl', {
        $scope: scope
      });
    }));

    it('should be exist', function() {
      expect(scope).toBeDefined();
      expect(Ctrl).toBeDefined();
      expect(Ctrl.postersList).toBeDefined();
      expect(Ctrl.View).toBeDefined();
      expect(Ctrl.Create).toBeDefined();
      expect(Ctrl.Update).toBeDefined();
      expect(Ctrl.Add).toBeDefined();
    });

    it('function "View"', function() {
      Ctrl.View(Ctrl.postersList[0]._id);
      expect(Ctrl.posterInf).toBeDefined();
      expect(Ctrl.posterInf).toEqual(Ctrl.postersList[0]);
      expect(scope.BtnView).toBeTruthy();
      expect(scope.BtnUpdate).toBeFalsy();
    });

    it('function "Create"', function() {
      Ctrl.posterInf= {
        title: 'test_title',
        body: 'test_body',
        startTime: 'test_startTime',
        room: 'test_room',
        monitor: 'test_monitor'
      };
      Ctrl.posterInf._id = Ctrl.posterInf.room;
      Ctrl.Create();
      expect(Ctrl.postersList[Ctrl.postersList.length -1]).toEqual(Ctrl.posterInf);
      expect(scope.BtnView).toBeTruthy();
      expect(scope.BtnUpdate).toBeFalsy();
      Ctrl.posterInf= {}
    });

    it('function "Update"', function() {
      Ctrl.posterInf= {
        _id: Ctrl.postersList[0]._id,
        title: 'test_title',
        body: 'test_body',
        startTime: 'test_startTime',
        room: 'test_room',
        monitor: 'test_monitor'
      };
      Ctrl.Update(Ctrl.posterInf._id, Ctrl.posterInf);
      expect(Ctrl.postersList[0]).toEqual(Ctrl.posterInf);
      expect(scope.BtnView).toBeTruthy();
      expect(scope.BtnUpdate).toBeFalsy();
      Ctrl.posterInf= {}
    });
  });
});
