const frisby = require('frisby');
const Joi = frisby.Joi;

//PUBLIC ENDPOINTS
it('GET /teamPub/all - expecting 200', function () {
    return frisby.get(`http://localhost:3001/teamPub/all`,)
        .expect('status', 200)
        .expect('jsonTypes', '[*]', {
            "_id": Joi.string().required(),
            "universityID": Joi.string().required(),
            "players": Joi.array().required(), //add in more details once arrays are finalized 
            "description": Joi.string().required(),
            "approvalStatus": Joi.boolean().required()
        }); 
});

// GET /teams/all 400 result needs test
// on this note: how??? there are always gonna be teams 
// need to discuss if this is a necessary test 

it('POST /teamPub/byID - expecting 200', function () {
    return frisby.post(`http://localhost:3001/teamPub/byID`, {
        "_id": "63cda0f91bc46e1982e593be"
    })
    .expect('status', 200)
    .expect('jsonTypes', '', {
        "_id": Joi.string().required(),
        "universityID": Joi.string().required(),
        "players": Joi.array().required(), //add in more details once arrays are finalized 
        "description": Joi.string().required(),
        "approvalStatus": Joi.boolean().required()
    });
});

it('POST /teamPub/byID - expecting 400 bad id', function () {
    return frisby.post(`http://localhost:3001/teamPub/byID`, {
        "_id": "63cda0f91bc46e1982e593fb"
    })
    .expect('status', 400)
    .expect('bodyContains', 'No Data Found'); 
});

it('POST /teamPub/byID - expecting 400 no body', function () {
    return frisby.post(`http://localhost:3001/teamPub/byID`, {})
    .expect('status', 400)
    // .expect('bodyContains', 'Request must contain university ID');  
});

it('POST /teamPub/byUniID - expecting 200', function () {
    return frisby.post(`http://localhost:3001/teamPub/byUniID`, {
        "universityID": 2760
    })
    .expect('status', 200);
    // .expect('jsonTypes', '', {
    //     "_id": Joi.string().required(),
    //     "universityID": Joi.string().required(),
    //     "players": Joi.array().required(), //add in more details once arrays are finalized 
    //     "description": Joi.string().required(),
    //     "approvalStatus": Joi.boolean().required()
    // });
});

it('POST /teamPub/byUniID - expecting 400 bad id', function () {
    return frisby.post(`http://localhost:3001/teamPub/byUniID`, {
        "universityID": 1111 //keeps giving a 200???? // hi this is Aaron, this is cuz we have issues with numbers vs strings throughout the whole backend
    })
    .expect('status', 400)
    .expect('bodyContains', 'No Data Found'); 
});

it('POST /teamPub/byUniID - expecting 400 no body', function () {
    return frisby.post(`http://localhost:3001/teamPub/byUniID`, {})
    .expect('status', 400)
    .expect('bodyContains', 'Request must contain university ID'); 
});

