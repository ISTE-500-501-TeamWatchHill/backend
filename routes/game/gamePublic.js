const express = require('express');
const router = express.Router();
const { GameInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require("bson-objectid");
const { validateNonNullStringHashID } = require('../auth/validation');

// Get all game information by id
router.post('/byID', async (req, res) => {
    if (req.body && req.body.id) {
        if (!validateNonNullStringHashID(req.body.id)){
            return res.status(403).json({'error': 'Game ID provided invalid'});
        }
        const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
        if (game === null) {
            return res.status(400).json({'error': 'No Data Found'});
        }
        else {
            return res.status(200).json(game);
        }
    }
    else {
        return res.status(400).json({'error': 'Request must contain game ID'});
    }
});

// Get all game information
router.get('/all', async (req, res) => {
    const game = await GameInfo.find({});
    if (game === null) {
        return res.status(400).json({'error': 'No Data Found'});
    }
    else {
        return res.status(200).json(game);
    }
});

// Get all game information + team info
router.get('/allExpanded', async (req, res) => {
    const game = await GameInfo.aggregate([
        {
            $lookup: {
                from: "teamInfo",
                localField: "homeTeam",
                foreignField: "_id",
                as: "homeTeamInfo"
            }
        },
        {
            $lookup: {
                from: "teamInfo",
                localField: "awayTeam",
                foreignField: "_id",
                as: "awayTeamInfo"
            }
        },
        {
            $lookup: {
                from: "universityInfo",
                localField: "universityID",
                foreignField: "universityID",
                as: "locationInfo"
            }
        },
        {
            $project:
            {
                gameID: 1,
                universityID: 1,
                homeTeam: 1,
                awayTeam: 1,
                winningTeam: 1,
                gameFinished: 1,
                gameTime: 1,
                homeTeamInfo: {
                    description: 1,
                    logo: 1,
                    universityID: 1,
                },
                awayTeamInfo: {
                    description: 1,
                    logo: 1,
                    universityID: 1,
                },
                locationInfo: {
                    name: 1,
                }
            }
        }
    ]);

    if (game === null) {
        return res.status(400).json({'error': 'No Data Found'});
    }
    else {
        return res.status(200).json(game);
    }
});

module.exports = router;