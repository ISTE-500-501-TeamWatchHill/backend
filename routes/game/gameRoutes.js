const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require('bson-objectid');
const {
    validateUniversityID,
    validateTeamID,
} = require('../auth/validation');

// Get all game information by id
router.get('/byID', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
        if (game === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(game);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

// Get all game information
router.get('/all', async (req, res) => {
    const game = await GameInfo.find({});
    if (game === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(game);
    }
});

// Update game information
router.put('/', async (req, res) => {

    if (req.body && req.body._id) {
        const updGame = await GameInfo.findOne({_id: ObjectId(req.body._id)});

        if (updGame) {
            const { updatedData } = req.body; // TODO: Validation for this is a mess
            GameInfo.updateOne({_id: updGame._id}, updatedData, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({result});
                }
            });
        }
        else {
            res.status(404).json({"error": "Game Not Found"});
        }
    }
    else {
        res.status(404).json({"error": "Incomplete Input"});
    }
        
});

// Create new game
router.post('/', async (req, res) => {
    if (req.body && req.body.universityID && req.body.homeTeam && req.body.awayTeam) {
        const { universityID, homeTeam, awayTeam } = req.body;

        // validate all input before adding to db
        if (!validateUniversityID(universityID)) {
            res.status(403).json({ 'error': 'UniversityID Invalid' });
        }
        if (!validateTeamID(homeTeam)) {
            res.status(403).json({ 'error': 'Home Team ID Invalid' });
        }
        if (!validateTeamID(awayTeam)) {
            res.status(403).json({ 'error': 'Away Team ID Invalid' });
        }

        const data = new GameInfo({
            universityID,
            homeTeam,
            awayTeam,
            winningTeam: null,
            gameFinished: false,
            gameTime: new Date()
        });

        try {
            const dta = await data.save();
            const dataToSave = await GameInfo.findOne({_id: dta._id});
            res.status(200).json(dataToSave);
        }
        catch (error) {
            res.status(500).json({'error': error});
        }
    }
    else {
        res.status(500).json({'error': "missing inputs"});
    }
});

router.delete('/', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
        try {
            const deleted = await GameInfo.deleteOne({_id: req.body._id});
            res.status(200).json(deleted);
        }
        catch (error) {
            console.log(error);
            res.status(500).json({"error": error});
        }
    }
    else {
        res.status(401).json({'error': "you are not authorized to complete this action"});
    }
});

module.exports = router;