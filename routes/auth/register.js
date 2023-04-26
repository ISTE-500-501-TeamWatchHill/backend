const express = require('express');
const router = express.Router();
const { UserInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { 
    validateEmail, 
    validatePassword, 
    validateNonNullNumberID, 
    validateName 
} = require('./validation');

router.post('/', async (req, res) => {
    // Our register logic starts here
    try {
        const { firstName, lastName, email, canMarket, password, universityID } = req.body;

        if (firstName && lastName && email && password && universityID) {
            // validate all input before adding to db
            if (!validateName(firstName)) {
                res.json({ 'error': 'First Name Invalid' });
                res.status(403);
                res.end();
            }
            if (!validateName(lastName)) {
                res.json({ 'error': 'Last Name Invalid' });
                res.status(403);
                res.end();
            }
            if (!validateEmail(email)) {
                res.json({ 'error': 'Email Invalid' });
                res.status(403);
                res.end();
            }
            if (!validatePassword(password)) {
                res.json({ 'error': 'Password Invalid' });
                res.status(403);
                res.end();
            }
            if (!validateNonNullNumberID(universityID)){
                res.json({ 'error': 'University ID Invalid' });
                res.status(403);
                res.end();
            }

            // email needs to end in an approved domain
            const { domain } = await UniversityInfo.findOne({ 'universityID': universityID }, {});
            const emailDomain = email.trim().split('@')[1];
            if (domain !== emailDomain) { 
                res.json({ 'error': "University and Domain must match" });
                res.status(403);
                res.end();
            }
            if (domain) {
                // Validate if user exist in our database
                const oldUser = await UserInfo.findOne({ email });

                if (oldUser) {
                    res.send("User Already Exist. Please Login");
                    res.status(409);
                    res.end();
                }


                //Encrypt user password
                let hashedPassword = await bcrypt.hash(password, 10);

                // Fix roleID
                // Create user in database
                const user = await UserInfo.create({
                    firstName,
                    lastName,
                    roleID: 19202,
                    universityID,
                    email: email.toLowerCase(), // Sanitization
                    teamID: null,
                    canMarket: canMarket || false,
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
                    "role": user.roleID,
                    "email": user.email,
                    "universityID": user.universityID,
                    "teamID": user.teamID,
                    "token": token,
                };

                // return new user
                res.json({ user: userReturned });
                res.status(201);
                res.end();
            }
            else {
                res.json({ 'error': 'Email Domain Does Not Match Accepted' });
                res.status(403);
                res.end();
            }
        }
        else {
            res.json({ 'error': 'All Input Not Found, Please Check Your Request' });
            res.status(403);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": ""+error});
        res.status(500);
        res.end();
    }
    // Our register logic ends here
});

module.exports = router;