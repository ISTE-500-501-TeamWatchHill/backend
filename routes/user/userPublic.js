const express = require('express');
const router = express.Router();
const { UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID, validateNonNullStringHashID } = require('../auth/validation');

// Get all user information by id without password
router.post('/byID', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            if (!validateNonNullStringHashID(req.body.id)) {
                res.status(403).json({'error': 'User `_id` Provided Invalid'});
            }
            // Does the line below actually work?
            const user = await UserInfo.findOne({_id: ObjectId(req.body.id)}, {hashedPassword: 0});
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
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Get all user information by id without password
router.get('/all', async (req, res) => {
    try {
        const user = await UserInfo.find({}, {hashedPassword: 0});
        if (user === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});


router.get('/allExpanded', async (req, res) => {
    try {
        const users = await UserInfo.aggregate([
            {
                $lookup: {
                    from: "teamInfo",
                    localField: "teamID",
                    foreignField: "_id",
                    as: "teamInfoJoined"
                }
            },
            {
                $project:
                {
                    roleID: 1,
                    universityID: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    teamInfoJoined: {
                        players: 1,
                        description: 1
                    }
                }
            }
        ]);

        if (users === null) {
            return res.status(400).json({'error': 'No Data Found'});
        }
        else {
            return res.status(200).json(users);
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

module.exports = router;