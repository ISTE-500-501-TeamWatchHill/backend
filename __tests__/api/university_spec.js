const frisby = require('frisby');

//GET /all 200
it('GET /universities/all - expecting 200',
 function () {
    return frisby.get(`http://localhost:3001/universities/all`) 
    .expect('status', 200);
});

//GET /all 400 
// again same question as teams 

//giving an error bc a get cannot have a body - looking into solutions rn  
//GET /byID 200
// it('GET /universities/byID - expecting 200',
//  function () {
//     return frisby.fetch(`http://localhost:3001/universities/byID`, {
//         method: 'QUERY',
//         body: JSON.stringify({
//             id: "63c99ff3a99866232ef88736"
//         })
//     }) 
//     .expect('status', 200);
// });

//GET /byID 400 - doesnt exist
// it('GET /universities/byID - expecting 200',
//  function () {
//     return frisby.fetch(`http://localhost:3001/universities/byID`, {
//         method: 'GET',
//         body: JSON.stringify({
//             id: "1"
//         })
//     }) 
//     .expect('status',400);
// });

// //GET /byID 400 - missing id 
// it('GET /universities/byID - expecting 200',
//  function () {
//     return frisby.fetch(`http://localhost:3001/universities/byID`, {
//         method: 'GET',
//         body: JSON.stringify({})
//     })
//     .expect('status',400);
// });