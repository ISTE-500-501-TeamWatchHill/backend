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
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(teams);
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
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(teams);
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
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(team);
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

// Get all team information by id
router.post('/byID', async (req, res) => {
    try {
        const { id } = req.body;
        if (req.body && id) {
            if (!validateNonNullStringHashID(id)) {
                res.json({'error': 'Invalid `_id`'});
                res.status(403);
                res.end();
            }
            const team = await TeamInfo.findOne({"_id": ObjectId(id)});
            if (team === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(team);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain team ID'});
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

router.post('/byUniID', async (req, res) => {
    try {
        const { universityID } = req.body;
        if (req.body && universityID) {
            if (!validateNonNullNumberID(universityID)) {
                res.json({'error': 'Invalid `universityID`'});
                res.status(403);
                res.end();
            }
            const unis = await TeamInfo.find({universityID: universityID});

            if (unis === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(unis);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain university ID'});
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

module.exports = router;