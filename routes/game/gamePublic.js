const express = require('express');
const router = express.Router();
const { GameInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require("bson-objectid");
const { validateNonNullStringHashID, validateNonNullNumberID } = require('../auth/validation');

// Get all game information by id
router.post('/byID', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            if (!validateNonNullStringHashID(req.body.id)){
                res.json({'error': 'Game ID provided invalid'});
                res.status(403);
                res.end();
            }
            const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
            if (game === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(game);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain game ID'});
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

router.post('/byTeamID', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            if (!validateNonNullStringHashID(req.body.id)){
                res.json({'error': 'Game ID provided invalid'});
                res.status(403);
                res.end();
            }
            const games = await GameInfo.aggregate([
                {$match: { $or: [
                    {"homeTeam": ObjectId(req.body.id)},
                    {"awayTeam": ObjectId(req.body.id)}
                ]}},
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
            if (games === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(games);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain game ID'});
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

router.post('/byUniversityID', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            if (!validateNonNullNumberID(req.body.id)){
                res.json({'error': 'University ID provided invalid'});
                res.status(403);
                res.end();
            }
            const games = await GameInfo.aggregate([
                {$match: { $or: [
                    {"universityID": req.body.id}
                ]}},
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
            if (games === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(games);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain game ID'});
            res.status(400);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": ""+error});
        res.status(500);
        res.end();
    }
});

// Get all game information
router.get('/all', async (req, res) => {
    try {
        const game = await GameInfo.find({});
        if (game === null) {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(game);
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

// Get all game information + team info
router.get('/allExpanded', async (req, res) => {
    try {
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
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(game);
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