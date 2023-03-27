const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const { validateNonNullNumberID, validateEmail } = require('../auth/validation');

// Create new team
router.post('/', async (req, res) => {
    /* 
        Questions:
            - Max / min amount of team members
            - Shouldn't we ensure all the users are from the same university?
            - Shouldn't this be sending out invites rather than auto-adding users?
            - How do we ensure that the user creating the team doesn't put in a different university's ID?
    */
    if (req.body && req.body.universityID && req.body.emails && req.body.emails.length > 0) {
        const { universityID, emails } = req.body;
        if (!validateNonNullNumberID(universityID)) {
            res.status(403).json({'error': 'Invalid University ID Provided'});
        }
        let goodUsers = [];
        let badUser = false;


        emails.forEach(async (email) => {
            if (!validateEmail(email)) {
                res.status(403).json({'error': 'Invalid Player Email Provided: ', email});
            }
            const user = await UserInfo.findOne({email: email}, {teamID: 1, _id: 1});
            if (user && user._id && user.teamID == null) {
                goodUsers.push(user._id);
            } else {
                badUser = true;
            }
        });

        if (badUser) {
            res.status(500).json({'error': 'A user provided is in a team'});
        } else {

            const data = new TeamInfo({
                universityID,
                goodUsers,
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
    } else {
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