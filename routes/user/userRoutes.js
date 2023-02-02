const express = require('express');
const router = express.Router();
const { UserInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all user information by id without password
router.get('/', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const user = await UserInfo.findOne({"_id": ObjectId(req.body.id)}, {hashedPassword: 0});
        if (user === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(user);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain user ID'})
    }
});

// Get all users that are not verified
router.get('/unverified', async (req, res) => {
    // Error Checking
    const users = await UserInfo.findMany({}, {hashedPassword: 0});
});

module.exports = router;