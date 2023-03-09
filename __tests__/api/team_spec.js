const { response } = require('express');
const frisby = require('frisby');

it('GET /teams/all - expecting 200', function () {
    return frisby.get(`http://localhost:3001/teams/all`,) //add auth
        .expect('status', 200); 
});

// GET /teams/all 400 result needs test
// on this note: how??? there are always gonna be teams 
// need to discuss if this is a necessary test 

// GET /teams/byID 200 response
// it('GET /teams/byID - expecting 200', function () {
//     return frisby.get(`http://localhost:3001/teams/byID`, {
//         "id": "63cda0f91bc46e1982e593be"
//     })
//         .expect('status', 200); 
// });

// GET /teams/byID 400 response - bad ID

// GET /teams/byID 400 response - not req.body 

