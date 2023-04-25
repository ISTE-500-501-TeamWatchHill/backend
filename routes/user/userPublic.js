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
                res.json({'error': 'User `_id` Provided Invalid'});
                res.status(403);
                res.end();
            }
            const user = await UserInfo.findOne({_id: ObjectId(req.body.id)}, {hashedPassword: 0});
            if (user === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(user);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain user ID'});
            res.status(400);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Get all user information by id without password
router.get('/all', async (req, res) => {
    try {
        const user = await UserInfo.find({}, {hashedPassword: 0});
        if (user === null) {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.status(200).json(user);
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
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
                    teamID: 1,
                    teamInfoJoined: {
                        players: 1,
                        description: 1
                    }
                }
            }
        ]);

        if (users === null) {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(users);
            res.status(200);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

module.exports = router;