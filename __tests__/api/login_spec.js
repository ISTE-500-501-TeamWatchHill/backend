const frisby = require('frisby');

it('POST /login - expecting a 200', function () {
    return frisby.post(`http://localhost:3001/login`, {
        email: "testUser@rit.edu",
        password: "Password1"
    })
      .expect('status', 200); 
});

it('POST /login - expecting a 400 wrong password', function () {
    return frisby.post(`http://localhost:3001/login`, {
        email: "testUser@rit.edu",
        password: "Password2"
    })
      .expect('status', 400);
});

it('POST /login - expecting a 400 wrong email', function () {
    return frisby.post(`http://localhost:3001/login`, {
        email: "testUser2@rit.edu",
        password: "Password1"
    })
      .expect('status', 400);
});

it('POST /login - expecting a 500 no body', function () {
    return frisby.post(`http://localhost:3001/login`, {})
      .expect('status', 500); //confirm response w aidan bc code says 400 
});