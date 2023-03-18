const frisby = require('frisby');
const Joi = frisby.Joi;

//TODO: secure endpoints 

//PUBLIC ENDPOINTS
it('GET /gamePub/all - expecting 200',
    function() {
        return frisby.get(`http://localhost:3001/gamePub/all`)
        .expect('status', 200)
        .expect('jsonTypes','[*]', { 
            "_id": Joi.string().required(),
            "universityID": Joi.number().required(), // um are these supposed to be strings or numbers? these are all being so weird
            "homeTeam": Joi.string().required(),
            "awayTeam": Joi.string().required(),
            "winningTeam": Joi.string().required(),
            "gameFinished": Joi.boolean().required(),
            "gameTime": Joi.date().iso().required()
        }); 
});

//how do i test 400 for get all games???


it('POST /gamePub/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/gamePub/byID`, {
        id: '63cd9f3f50a719089bd1feb6' 

    }) 
    .expect('status', 200)
    .expect('jsonTypes','', {
        "_id": Joi.string().required(),
        "universityID": Joi.string().required(),
        "homeTeam": Joi.string().required(),
        "awayTeam": Joi.string().required(), // uhhhhh again strings or numbers people
        "winningTeam": Joi.string().required(),
        "gameFinished": Joi.boolean().required(),
        "gameTime": Joi.date().iso().required()
    }); 
});

it('POST /gamePub/byID - expecting 400',
 function () {
    return frisby.post(`http://localhost:3001/gamePub/byID`, {
        id: 1 
    }) 
    .expect('status', 400)
    .expect('bodyContains', 'No Data Found'); //getting the wrong error message
});

it('POST /gamePub/byID - expecting 400',
 function () {
    return frisby.post(`http://localhost:3001/gamePub/byID`,{}) 
    .expect('status', 400)
    .expect('bodyContains', 'Request must contain game ID'); 
});