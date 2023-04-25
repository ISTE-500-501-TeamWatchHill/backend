const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require('bson-objectid');
const {
    validateNonNullNumberID,
    validateNonNullStringHashID,
} = require('../auth/validation');

// Update game information
router.put('/', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            if(!validateNonNullStringHashID(req.body.id)) {
                res.json({'error': 'Game ID provided invalid'});
                res.status(400);
                res.end();
            }
            const updGame = await GameInfo.findOne({_id: ObjectId(req.body.id)});

            if (updGame) {
                const { updatedData } = req.body; // TODO: Validation for this is a mess
                GameInfo.updateOne({_id: updGame.id}, updatedData, function (err, result) {
                    if (err !== null) {
                        res.json(err);
                        res.status(500);
                        res.end();
                    }
                    else {
                        res.json({result});
                        res.status(200);
                        res.end();
                    }
                });
            }
            else {
                res.json({"error": "Game Not Found"});
                res.status(404);
                res.end();
            }
        }
        else {
            res.json({"error": "Incomplete Input"});
            res.status(404);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Create new game
router.post('/', async (req, res) => {
    try {
        if (req.body && req.body.universityID && req.body.homeTeam && req.body.awayTeam) {
            const { universityID, homeTeam, awayTeam } = req.body;

            // validate all input before adding to db
            if (!validateNonNullNumberID(universityID)) {
                res.json({ 'error': 'University ID Invalid' });
                res.status(403);
                res.end();
            }
            if (!validateNonNullStringHashID(homeTeam)) {
                res.json({ 'error': 'Home Team ID Invalid' });
                res.status(403);
                res.end();
            }
            if (!validateNonNullStringHashID(awayTeam)) {
                res.json({ 'error': 'Away Team ID Invalid' });
                res.status(403);
                res.end();
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
                res.json(dataToSave);
                res.status(200);
                res.end();
            }
            catch (error) {
                res.json({'error': error});
                res.status(500);
                res.end();
            }
        }
        else {
            res.json({'error': "missing inputs"});
            res.status(500);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Delete game by ID
router.delete('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            try {
                const deleted = await GameInfo.deleteOne({_id: req.body.id});
                res.json(deleted);
                res.status(200);
                res.end();
            }
            catch (error) {
                res.json({"error": error});
                res.status(500);
                res.end();
            }
        }
        else {
            res.json({'error': "you are not authorized to complete this action"});
            res.status(401);
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