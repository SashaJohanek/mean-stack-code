'use strict';

describe('Service: Items', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Items;
  beforeEach(inject(function (_Items_) {
    Items = _Items_;
  }));

  it('should do something', function () {
    expect(!!Items).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Items.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Items.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Items.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Items.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Items.deleteImage).toBeDefined();
  });
});
