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
        email = email.toLowerCase();

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
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
                "email": user.email,
                "token": token,
            };

            // user
            res.status(200).json({ user: userReturned });
        }
        else {
            res.status(400).send("Invalid Credentials");

        }
    } catch (err) {
        console.log(err);
        res.status(500).send('Server Error Occurred');
    }
    // Our register logic ends here
});

module.exports = router;