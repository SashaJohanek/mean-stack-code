'use strict';

describe('Service: Courses', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Courses;
  beforeEach(inject(function(_Courses_) {
    Courses = _Courses_;
  }));

  it('should be exist', function() {
    expect(!!Courses).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Courses.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Courses.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Courses.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Courses.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Courses.deleteImage).toBeDefined();
  });
});
