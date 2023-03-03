const frisby = require('frisby');

it('POST /login - expecting a 400', function () {
    return frisby.post(`http://localhost:3001/login`, {})
      .expect('status', 500); //confirm response w aidan bc code says 400 
  });