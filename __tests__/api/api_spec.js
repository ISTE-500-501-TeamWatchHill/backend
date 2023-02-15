const frisby = require('frisby');

it('should be a teapot', function () {
  return frisby.get('http://httpbin.org/status/418')
    .expect('status', 418);
});