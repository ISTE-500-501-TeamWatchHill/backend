const frisby = require('frisby');
const Joi = frisby.Joi;

//GET /all 200
it('GET /userPub/all - expecting 200',
 function () {
    return frisby.get(`http://localhost:3001/userPub/all`) 
    .expect('status', 200)
    .expect('jsonTypes','[*]', {
        "_id": Joi.string().required(),
        "roleID": Joi.number().required(),
        "firstName": Joi.string().required(),
        "lastName": Joi.string().required(),
        "email": Joi.string().required(),
        "canMarket": Joi.boolean().required()
    });
});

//again how to check 400??? 

//GET /byID 200
it('POST /userPub/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/userPub/byID`, {
        "id": "63dc13d781065d0c7dfb7f20"
    }) 
    .expect('status', 200)
    .expect('jsonTypes','', {
        "_id": Joi.string().required(),
        "roleID": Joi.number().required(),
        "firstName": Joi.string().required(),
        "lastName": Joi.string().required(),
        "email": Joi.string().required(),
        "canMarket": Joi.boolean().required()
    });
});

//GET / 400 - not found
it('POST /userPub/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/userPub/byID`, {
        "id": "63dc13d781065d0c7dfb7f30"
    }) 
    .expect('status', 400)
    .expect('bodyContains', 'No Data Found');  
});

//GET / 400 - missing id
it('POST /userPub/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/userPub/byID`, {}) 
    .expect('status', 400)
    .expect('bodyContains', 'Request must contain user ID');  
});