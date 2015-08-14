'use strict';

describe('Service: Offers', function() {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var Offers;
  beforeEach(inject(function(_Offers_) {
    Offers = _Offers_;
  }));

  it('should be exist', function() {
    expect(!!Offers).toBe(true);
  });

  it('get() should be defined', function() {
    expect(Offers.get).toBeDefined();
  });

  it('active() should be defined', function() {
    expect(Offers.active).toBeDefined();
  });

  it('findOne() should be defined', function() {
    expect(Offers.findOne).toBeDefined();
  });

  it('delete() should be defined', function() {
    expect(Offers.delete).toBeDefined();
  });

});
