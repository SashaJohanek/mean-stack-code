'use strict';

ddescribe('Service: posters', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Posters;
  beforeEach(inject(function (_Posters_) {
    Posters = _Posters_;
  }));

  it('should be exist', function () {
    expect(!!Posters).toBe(true);
  });

  it('query() should be defined', function() {
    expect(Posters.query).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Posters.get).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Posters.delete).toBeDefined();
  });

});
