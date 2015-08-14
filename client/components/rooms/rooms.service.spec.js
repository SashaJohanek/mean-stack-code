'use strict';

describe('Service: Rooms', function () {

  // load the service's module
  beforeEach(module('newsApp'));

  // instantiate service
  var rooms;
  beforeEach(inject(function (_rooms_) {
    rooms = _rooms_;
  }));

  it('should do something', function () {
    expect(!!rooms).toBe(true);
  });

});
