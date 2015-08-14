'use strict';

describe('Service: lectures', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Lectures;
  beforeEach(inject(function (_Lectures_) {
    Lectures = _Lectures_;
  }));

  it('should be exist', function () {
    expect(!!Lectures).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Lectures.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Lectures.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Lectures.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Lectures.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Lectures.deleteImage).toBeDefined();
  });

});
