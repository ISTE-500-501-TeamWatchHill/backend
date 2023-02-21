const express = require('express');
const router = express.Router();
const { UserInfo, Permissions } = require('../../model/model');
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

// Change user permission definition
router.put('/permission', async (req, res) => {
    // Make sure requesting user is an admin
    const reqUser = await UserInfo.findOne({_id: ObjectId(req.user.user_id)}, {roleID: 1});

    if (reqUser && reqUser.roleID && reqUser.roleID == 1234 || reqUser.roleID == 2468) {
        console.log('success');

        if (req.body.uid) {
            const updUser = await UserInfo.findOne({_id: ObjectId(req.body.uid)});

            if (updUser) {
                const updatedData = {
                    roleID: req.body.roleID
                };

                UserInfo.updateOne({_id: ObjectId(req.body.uid)}, updatedData, function (err, result) {
                    if (err !== null) {
                        res.status(500).json(err);
                    }
                    else {
                        res.status(200).json({"_id": id, "newID": req.body.roleID});
                    }
                });
            }
        }
        
    }
});

module.exports = router;