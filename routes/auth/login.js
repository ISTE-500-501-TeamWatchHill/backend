const express = require('express');
const router = express.Router();
const { UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        let { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.send("All input is required");
            res.status(400);
            res.end();
        }
        
        // Validate if user exist in our database
        email = email.toLowerCase();
        const user = await UserInfo.findOne({ email });

        if (user && (await bcrypt.compareSync(password, user.hashedPassword, 10))) {
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

            // user
            res.json({ user: userReturned });
            res.status(200);
            res.end();
        }
        else {
            res.send("Invalid Credentials");
            res.status(400);
            res.end();

        }
    } catch (err) {
        res.send('Server Error Occurred');
        res.status(500);
        res.end();
    }
    // Our login logic ends here
});

module.exports = router;