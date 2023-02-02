const express = require('express');
const router = express.Router();
const { User } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

router.post('/', async (req, res) => {
    // Our login logic starts here
    try {
        // Get user input
        const { email, password } = req.body;

        // Validate user input
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // Validate if user exist in our database
        const user = await User.findOne({ email });

        if (user && (await bcrypt.compare(password, user.password))) {
            // Create token
            const token = jwt.sign(
                { user_id: user._id, email },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "24h",
                }
            );

            // save user token
            user.token = token;

            // user
            res.status(200).json({ token: user.token });
        }
        else {
            res.status(400).send("Invalid Credentials");

        }
    } catch (err) {
        console.log(err);
    }
    // Our register logic ends here
});

module.exports = router;