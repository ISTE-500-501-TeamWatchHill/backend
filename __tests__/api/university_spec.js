const frisby = require('frisby');
const Joi = frisby.Joi;

//GET /all 200
it('GET /universities/all - expecting 200',
 function () {
    return frisby.get(`http://localhost:3001/universityPub/all`) 
    .expect('status', 200)
    .expect('jsonTypes', '[*]', {
        "_id": Joi.string().required(),
        "universityID": Joi.number().required(),
        "name": Joi.string().required(), 
        "description": Joi.string().required(),
        "approvalStatus": Joi.boolean().required(),
        "domain": Joi.string().required()
    });
});

//GET /all 400 
// again same question as teams 

//POST /byID 200
it('POST /universities/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/universityPub/byID`, {
        "id": 2760
    })
    .expect('status', 200)
    .expect('jsonTypes', '', {
        "_id": Joi.string().required(),
        "universityID": Joi.number().required(),
        "name": Joi.string().required(), 
        "description": Joi.string().required(),
        "approvalStatus": Joi.boolean().required(),
        "domain": Joi.string().required()
    });
});

//POST /byID 400 - bad id
it('POST /universities/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/universityPub/byID`, {
        "id": 0
    })
    .expect('status', 400)
    .expect('bodyContains', 'No Data Found');  
});

//POST /byID 400 - missing id
it('POST /universities/byID - expecting 200',
 function () {
    return frisby.post(`http://localhost:3001/universityPub/byID`, {})
    .expect('status', 400)
    .expect('bodyContains', 'Request must contain university ID');  
});