const frisby = require('frisby');
const { generateRandomString } = require('../../routes/auth/validation');

// POST / 409 - existing user

// POST / 201 - existing user

// POST / 403 - bad email

// POST / 403 - missing info

// POST / 403 - bad password
it('POST /register - expecting a 403 bad password', function () {
    return frisby.post(`http://localhost:3001/register`, {
        firstName: 'Test',
        lastName: 'Test',
        email: `${generateRandomString()}@rit.edu`,
        canMarket: false,
        password: "password."
    })
      .expect('status', 403);
});
