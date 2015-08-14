'use strict';

describe('Service: Categories', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Categories;
  beforeEach(inject(function(_Categories_) {
    Categories = _Categories_;
  }));

  it('should be exist', function() {
    expect(!!Categories).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Categories.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Categories.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Categories.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Categories.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Categories.deleteImage).toBeDefined();
  });
});
