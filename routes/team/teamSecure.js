const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const { validateNonNullNumberID, validateEmail } = require('../auth/validation');

// Create new team
router.post('/', async (req, res) => {
    
    // TODO: Sending out invites rather than auto-adding users
    if (req.body && req.body.universityID && req.body.emails) {
        const { universityID, emails } = req.body;
        if (!validateNonNullNumberID(universityID)) {
            return res.status(403).json({'error': 'Invalid University ID Provided'});
        }

        let goodUsers = [];
        let badUser = false;

        if (emails.length < 1 || emails.length > 5) {
            return res.status(403).json({'error': 'Invalid number of emails provided; must be between 1 and 5 users.'});
        }
        emails.forEach(async (email) => {
            if (!validateEmail(email)) {
                return res.status(403).json({'error': 'Invalid Player Email Provided: ', email});
            }

            // TODO: get their university as well, confirm it's all the same university, and the same university passed in
            const user = await UserInfo.findOne({email: email}, {teamID: 1, _id: 1});
            if (user && user._id && user.teamID == null) {
                goodUsers.push(user._id);
            } else {
                badUser = true;
            }
        });

        if (badUser) {
            return res.status(500).json({'error': 'A user provided is in a team'});
        } else {

            const data = new TeamInfo({
                universityID,
                goodUsers,
                approvalStatus: false,
            });

            try {
                const dta = await data.save();
                const dataToSave = await TeamInfo.findOne({_id: dta._id});
                return res.status(200).json(dataToSave);
            }
            catch (error) {
                return res.status(500).json({'error': error});
            }
        }
    } else {
        return res.status(500).json({'error': "missing inputs"});
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