const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const { validateNonNullNumberID, validateEmail, validateName } = require('../auth/validation');

/*
    Writing this shit out because I'm fucking dizzy

    // TODO: Work on invites and moderator approvals

    -[x] take in name, emails, and universityID
    -[x] validate name
    -[x] validate if name is already used
    -[x] validate universityID
    -[x] validate emails.length > 0 && emails.length < 6
    -[x] validate emails
    -[x] validate user exists
    -[x] validate emails belong to users from same university
    -[x] validate emails belong to users with no teams
    -[x] create team w/ false approval status, name, emails, and universityID
    -[x] add new teamID to all users in team
*/

// Create new team
router.post('/', async (req, res) => {
        try {
        if (req.body && req.body.universityID && req.body.emails && req.body.name) {
            const { universityID, emails, name } = req.body;

            if (!validateName(name)) {
                res.status(403).json({'error': 'Invalid Team Name Provided'});
                res.end();
            }

            const teamExistsCheck = await TeamInfo.findOne({ description: name });
            if (teamExistsCheck && teamExistsCheck._id) {
                res.status(403).json({'error': 'Team Name Provided Already Exists'});
                res.end();
            }

            if (!validateNonNullNumberID(universityID)) {
                res.status(403).json({'error': 'Invalid University ID Provided'});
                res.end();
            }

            if (emails.length < 1 || emails.length > 5) {
                res.status(403).json({'error': 'Invalid number of emails provided; must be between 1 and 5 users.'});
                res.end();
            }

            let confirmedUsers = [];
            const validateUsers = async () => {
                for (const email of emails) {
                    if (!validateEmail(email)) {
                        res.status(403).json({'error': 'Invalid Player Email Provided: ' + email});
                        res.end();
                    }

                    const user = await UserInfo.findOne(
                        { email: email }, 
                        { 
                            teamID: 1, 
                            _id: 1, 
                            universityID: 1
                        });
                
                    if (user && user._id && (user.universityID == universityID) && (user.teamID == null)) {
                        confirmedUsers.push(user._id);
                    } else {
                        res.status(403).json({'error': 'User already on a team: ' + email});
                        res.end();
                    } 
                };
            }

            await validateUsers();

            const data = new TeamInfo({
                universityID,
                players: confirmedUsers,
                description: name,
                approvalStatus: false,
            });

            try {
                const dta = await data.save();
                const dataToSave = await TeamInfo.findOne({_id: dta._id});
                const addTeamIdToUsers = async () => {
                    for (const email of emails) {
                        await UserInfo.updateOne({ "email": email }, { $set: { "teamID": dta._id }});
                    }
                };
                await addTeamIdToUsers();
                res.status(200).json(dataToSave);
                res.end();
            }
            catch (error) {
                res.status(500).json({'error': "" + error});
                res.end();
            }
            
        } else {
            res.status(500).json({'error': "missing inputs"});
            res.end();
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
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