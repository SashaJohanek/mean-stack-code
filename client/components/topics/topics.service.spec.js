'use strict';

describe('Service: Topics', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Topics;
  beforeEach(inject(function(_Topics_) {
    Topics = _Topics_;
  }));

  it('should be exist', function() {
    expect(!!Topics).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Topics.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Topics.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Topics.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Topics.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Topics.deleteImage).toBeDefined();
  });

  it('map() should be defined', function() {
    expect(Topics.map).toBeDefined();
  });
});
