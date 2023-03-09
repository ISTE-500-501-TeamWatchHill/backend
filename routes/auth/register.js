const express = require('express');
const router = express.Router();
const { UserInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    // Our register logic starts here
    try {
        const { uid, firstName, lastName, email, password } = req.body;

        if (uid && uid > 0 && firstName && firstName.length > 0 && lastName && lastName.length > 0 && email && email.length > 0 && password && password.length > 0) {
            // email needs to end in an approved domain
            const emailDomain = email.split('@')[1];
            const domain = await UniversityInfo.findOne({ 'domain': emailDomain }, {});
            if (domain) {
                // Validate if user exist in our database
                const oldUser = await UserInfo.findOne({ email });

                if (oldUser) {
                    return res.status(409).send("User Already Exist. Please Login");
                }

                const { universityID } = domain;

                //Encrypt user password
                let hashedPassword = await bcrypt.hash(password, 10);

                // Fix roleID
                // Create user in database
                const user = await UserInfo.create({
                    uid,
                    firstName,
                    lastName,
                    roleID: 19202,
                    universityID,
                    email: email.toLowerCase(), // Sanitization
                    hashedPassword
                });

                // Create token
                const token = jwt.sign(
                    { user_id: user._id, email, roleID: user.roleID },
                    process.env.TOKEN_KEY,
                    {
                        expiresIn: "24h",
                    }
                );
                // save user token
                const userReturned = {
                    "firstName": user.firstName,
                    "lastName": user.lastName,
                    "email": user.email,
                    "token": token,
                };

                // return new user
                res.status(201).json({ user: userReturned });
            }
            else {
                // check this status code..
                res.status(403).json({ 'error': 'Email Domain Does Not Match Accepted' });
            }
        }
        else {
            // check this status code..
            res.status(403).json({ 'error': 'All Input Not Found, Please Check Your Request' });
        }
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = router;