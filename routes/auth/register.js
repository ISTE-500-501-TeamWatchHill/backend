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
        const { firstName, lastName, email, canMarket, password } = req.body;

        if (firstName && lastName && email && password) {
            // validate all input before adding to db
            if (!validateName(firstName)) {
                return res.status(403).json({ 'error': 'First Name Invalid' });
            }
            if (!validateName(lastName)) {
                return res.status(403).json({ 'error': 'Last Name Invalid' });
            }
            if (!validateEmail(email)) {
                return res.status(403).json({ 'error': 'Email Invalid' });
            }
            if (!validatePassword(password)) {
                return res.status(403).json({ 'error': 'Password Invalid' });
            }

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
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
    // Our register logic ends here
});

module.exports = router;