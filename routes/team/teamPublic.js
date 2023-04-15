const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullStringHashID, validateNonNullNumberID } = require('../auth/validation');

// Get all teams
router.get('/all', async (req, res) => {
    try {
        const teams = await TeamInfo.find({});
        if (teams === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(teams);
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Get all team information + player and university info
router.get('/allExpanded', async (req, res) => {
    try {
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
                    universityInfo: {
                        approvalStatus: 1,
                        name: 1,
                        description: 1,
                        logo: 1,
                        universityID: 1,
                        domain: 1,
                        moderatorID: 1
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
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Get one team's information + player and university info
router.post('/byIDExpanded', async (req, res) => {
    try {
        const { id } = req.body;
        const team = await TeamInfo.aggregate([
            {$match: {_id: ObjectId(id)}},
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
                    universityName: "$universityInfo.name"
                        
                }
            }
        ]);

        if (team === null) {
            return res.status(400).json({'error': 'No Data Found'});
        }
        else {
            return res.status(200).json(team);
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Get all team information by id
router.post('/byID', async (req, res) => {
    try {
        const { id } = req.body;
        if (req.body && id) {
            if (!validateNonNullStringHashID(id)) {
                return res.status(403).json({'error': 'Invalid `_id`'});
            }
            const team = await TeamInfo.findOne({"_id": ObjectId(id)});
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
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

router.post('/byUniID', async (req, res) => {
    try {
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
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

module.exports = router;