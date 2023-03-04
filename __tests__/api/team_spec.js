const { response } = require('express');
const frisby = require('frisby');

it('GET /teams/all - expecting 200', function () {
    return frisby.get(`http://localhost:3001/teams/all`,) //add auth
        .expect('status', 200); 
});

