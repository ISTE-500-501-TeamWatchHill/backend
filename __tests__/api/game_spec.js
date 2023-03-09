const frisby = require('frisby');

// GET / 200 
it('GET /games/ - expecting 200',
 function () {
    return frisby.get(`http://localhost:3001/games/`, {
        id: '63cd9f3f50a719089bd1feb6' 

    }) 
    .expect('status', 200); 
});

// GET / 400 - incorrect id
it('GET /games/ - expecting 400',
 function () {
    return frisby.get(`http://localhost:3001/games/`, {
        id: 1 
    }) 
    .expect('status', 400); //getting the wrong error message
});

// GET / 400 - missing id
it('GET /games/ - expecting 400',
 function () {
    return frisby.get(`http://localhost:3001/games/`,{}) 
    .expect('status', 400); 
});