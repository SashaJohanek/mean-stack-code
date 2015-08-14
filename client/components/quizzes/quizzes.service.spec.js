'use strict';

describe('Service: Quizzes', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Quizzes;
  beforeEach(inject(function (_Quizzes_) {
    Quizzes = _Quizzes_;
  }));

  it('should be exist', function () {
    expect(!!Quizzes).toBe(true);
  });

  it('create() should be defined', function() {
    expect(Quizzes.create).toBeDefined();
  });

  it('get() should be defined', function() {
    expect(Quizzes.get).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Quizzes.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Quizzes.delete).toBeDefined();
  });
});
