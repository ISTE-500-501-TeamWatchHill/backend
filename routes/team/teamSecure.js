const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullStringHashID, validateNonNullNumberID } = require('../auth/validation');

// Create new team
router.post('/', async (req, res) => {
    /*
    - Max / min amount of team members??
    */
    if (req.body && req.body.universityID && req.body.players && req.body.players.length > 0) {
        const { universityID, players } = req.body;
        if (!validateNonNullNumberID(universityID)) {
            res.status(403).json({'error': 'Invalid University ID Provided'});
        }
        let goodUsers = [];
        let badUser = false;


        players.forEach(async (player) => {
            if (!validateNonNullStringHashID(ObjectId(player))) {
                res.status(403).json({'error': 'Invalid Player Provided: ', player});
            }
            const user = await UserInfo.findOne({_id: ObjectId(player)}, {teamID: 1, _id: 1});
            if (user && user._id && user.teamID == null) {
                goodUsers.push(user);
            }
            else {
                badUser = true;
            }
        });

        if (badUser) {
            res.status(500).json({'error': 'User is in a team'});
        }
        else {
            // goodUsers.forEach((user) => {
                // console.log(user);
            // });

            const data = new TeamInfo({
                universityID,
                players,
                approvalStatus: false,
            });

            try {
                const dta = await data.save();
                const dataToSave = await TeamInfo.findOne({_id: dta._id});
                res.status(200).json(dataToSave);
            }
            catch (error) {
                res.status(500).json({'error': error});
            }
        }
    }
    else {
        res.status(500).json({'error': "missing inputs"});
    }
});

// Update existing team // TODO: Guessing this got missed in the copy+paste
/*
router.put('/', async (req, res) => {
    if (req.body && req.body._id) {
        const updGame = await GameInfo.findOne({_id: ObjectId(req.body._id)});

        if (updGame) {
            const {updatedData} = req.body;
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
*/
module.exports = router;