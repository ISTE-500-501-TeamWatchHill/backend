const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

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

// Get all team information by id
router.get('/byID', async (req, res) => {
    // Error Checking
    if (req.body && req.body._id) {
        const team = await TeamInfo.findOne({"_id": ObjectId(req.body._id)});
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

router.get('/byUniID', async (req, res) => {
    if (req.body && req.body.universityID) {
        const unis = await TeamInfo.find({universityID: req.body.universityID});

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

// Create new team
router.post('/', async (req, res) => {
    /*
    - Max / min amount of team members??
    */
    if (req.body && req.body.universityID && req.body.players && req.body.players.length > 0) {
        const {universityID, players} = req.body;
        let goodUsers = [];
        let badUser = false;


        players.forEach(async (player) => {
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
            goodUsers.forEach((user) => {
                console.log(user);
            });

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

// Update existing team
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

module.exports = router;