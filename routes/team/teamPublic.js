const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullStringHashID, validateNonNullNumberID } = require('../auth/validation');

// Get all teams
router.get('/all', async (req, res) => {
    const teams = await TeamInfo.find({});
    if (teams === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(teams);
    }
});

// Get all team information + player and university info
router.get('/allExpanded', async (req, res) => {
    const teams = await TeamInfo.aggregate([
        {
            $lookup: {
                from: "universityInfo",
                localField: "universityID",
                foreignField: "universityID",
                as: "universityInfo"
            }
        },
        {
            $project:
            {
                approvalStatus: 1,
                logo: 1,
                description: 1,
                players: 1,
                homeTeamInfo: {
                    description: 1,
                    logo: 1,
                    universityID: 1,
                }
            }
        }
    ]);

    if (teams === null) {
        return res.status(400).json({'error': 'No Data Found'});
    }
    else {
        return res.status(200).json(teams);
    }
});

// Get all team information by id
router.post('/byID', async (req, res) => {
    const { _id } = req.body;
    if (req.body && _id) {
        if (!validateNonNullStringHashID(_id)) {
            return res.status(403).json({'error': 'Invalid `_id`'});
        }
        const team = await TeamInfo.findOne({"_id": ObjectId(_id)});
        if (team === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(team);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain team ID'});
    }
});

router.post('/byUniID', async (req, res) => {
    const { universityID } = req.body;
    if (req.body && universityID) {
        if (!validateNonNullNumberID(universityID)) {
            return res.status(403).json({'error': 'Invalid `universityID`'});
        }
        const unis = await TeamInfo.find({universityID: universityID});

        if (unis === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(unis);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

module.exports = router;