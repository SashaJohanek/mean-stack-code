'use strict';

describe('Service: Grades', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Grades;
  beforeEach(inject(function(_Grades_) {
    Grades = _Grades_;
  }));

  it('should be exist', function() {
    expect(!!Grades).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Grades.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Grades.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Grades.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Grades.delete).toBeDefined();
  });

  it('deleteImage() should be defined', function() {
    expect(Grades.deleteImage).toBeDefined();
  });
});
