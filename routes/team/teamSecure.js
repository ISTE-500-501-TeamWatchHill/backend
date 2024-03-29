const express = require('express');
const router = express.Router();
const { TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const { validateNonNullNumberID, validateEmail, validateName } = require('../auth/validation');
let ObjectId = require("bson-objectid");

/*
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

            if (req.user.roleID == 19202) {
                if (!emails.includes(req.user.email)) {
                    console.log("User creating team must be apart of the team");
                    res.json({'error': 'User creating team must be apart of the team'});
                    res.status(403);
                    res.end();
                }
            }

            if (!validateName(name)) {
                res.json({'error': 'Invalid Team Name Provided'});
                res.status(403);
                res.end();
            }

            const teamExistsCheck = await TeamInfo.findOne({ description: name });
            if (teamExistsCheck && teamExistsCheck._id) {
                res.json({'error': 'Team Name Provided Already Exists'});
                res.status(403);
                res.end();
            }

            if (!validateNonNullNumberID(universityID)) {
                res.json({'error': 'Invalid University ID Provided'});
                res.status(403);
                res.end();
            }

            if (emails.length < 1 || emails.length > 5) {
                res.json({'error': 'Invalid number of emails provided; must be between 1 and 5 users.'});
                res.status(403);
                res.end();
            }

            let confirmedUsers = [];
            const validateUsers = async () => {
                for (const email of emails) {
                    if (!validateEmail(email)) {
                        res.json({'error': 'Invalid Player Email Provided: ' + email});
                        res.status(403);
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
                        res.json({'error': 'User already on a team: ' + email});
                        res.status(403);
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
                res.json(dataToSave);
                res.status(200);
                res.end();
            }
            catch (error) {
                res.json({'error': "" + error});
                res.status(500);
                res.end();
            }
            
        } else {
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

// Update existing team
router.put('/', async (req, res) => {
    try {
        if (req.body && req.body.id) {
            const updTeam = await TeamInfo.findOne({_id: ObjectId(req.body.id)});

            if (updTeam) {
                const { universityID, emails, description, approvalStatus } = req.body.updatedData;
                // validate and reformat input emails
                if (!validateName(description)) {
                    res.json({'error': 'Invalid Team Name Provided'});
                    res.status(403);
                    res.end();
                }
    
                if (!validateNonNullNumberID(universityID)) {
                    res.json({'error': 'Invalid University ID Provided'});
                    res.status(403);
                    res.end();
                }
    
                if (emails.length < 1 || emails.length > 5) {
                    res.json({'error': 'Invalid number of emails provided; must be between 1 and 5 users.'});
                    res.status(403);
                    res.end();
                }

                let confirmedUsers = [];
                const validateUsers = async () => {
                    for (const email of emails) {
                        if (!validateEmail(email)) {
                            res.json({'error': 'Invalid Player Email Provided: ' + email});
                            res.status(400);
                            res.end();
                        }

                        const user = await UserInfo.findOne(
                            { email: email }, 
                            { 
                                teamID: 1, 
                                _id: 1, 
                                universityID: 1
                            });
                    
                        if (user && user._id && (user.universityID == universityID) && (user.teamID == null || updTeam.players.includes(user._id))) {
                            confirmedUsers.push(user._id);
                        } else {
                            res.json({'error': 'User already on a team: ' + email});
                            res.status(400);
                            res.end();
                        } 
                    };
                }

                await validateUsers();

                // confirmedUsers // _id's of users we want in team -- some may already belong; some may not
                // updTeam.players // _id's of users already in database on the team

                let updatedDataWithIDs = {
                    players: confirmedUsers,
                    universityID: universityID || null,
                    description: description || null,
                    approvalStatus: approvalStatus || false,
                }

                // do the update
                TeamInfo.updateOne({_id: Object(req.body.id)}, updatedDataWithIDs, function (err, result) {
                    if (err !== null) {
                        res.json({"error": "Error updating the team"});
                        res.status(500);
                        res.end();
                    }
                    else {
                        // res.status(200).json({result}); // continue on for now
                    }
                });
                const addTeamIdToUsers = async () => {
                    for (const email of emails) {
                        await UserInfo.updateOne({ "email": email }, { $set: { "teamID": req.body.id }});
                    }
                };
                await addTeamIdToUsers();
                const removeTeamIdFromOldUsers = async () => {
                    for (const oldPlayer of updTeam.players) {
                        if(!confirmedUsers.map(user => user.toString()).includes(oldPlayer.toString())) { // used to be on the team, but is no longer
                            console.log("removing teamID for: ", oldPlayer);
                            await UserInfo.updateOne({ "_id": ObjectId(oldPlayer) }, { $set: { "teamID": null }});
                        }
                    }
                }
                console.log("updated team: ", confirmedUsers);
                console.log("old team: ", updTeam.players);
                await removeTeamIdFromOldUsers();
                res.json({ "message": "Team update successful" });
                res.status(200);
                res.end();
            }
            else {
                res.json({"error": "Team Not Found"});
                res.status(400);
                res.end();
            }
        }
        else {
            res.json({"error": "Incomplete Input"});
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

// Delete existing team by ID
router.delete('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            if (!ObjectId.isValid(req.body.id)) {
                res.json({ 'error': '`_id` Provided Invalid' });
                res.status(403);
                res.end();
            }
            try {
                const teamToBeDeleted = await TeamInfo.findOne({"_id": ObjectId(req.body.id)});
                const removeTeamIDFromPlayers = async () => {
                    for (const player of teamToBeDeleted.players) {
                        await UserInfo.updateOne({ "_id": ObjectId(player._id) }, { $set: { "teamID": null }});
                    }
                }
                if (teamToBeDeleted.players && teamToBeDeleted.players.length >= 1) {
                    await removeTeamIDFromPlayers();
                }
                const deleted = await TeamInfo.deleteOne({"_id": ObjectId(req.body.id)});

                res.json(
                    {"Team Deleted": teamToBeDeleted}
                );
                res.status(200);
                res.end();
            }
            catch (error) {
                res.json({"error": ""+error});
                res.status(500);
                res.end();
            }
        }
        else {
            res.json({'error': "You are not authorized to complete this action"});
            res.status(401);
            res.end()
        }
    }
    catch (error) {
        res.json({"error": ""+error});
        res.status(500);
        res.end();
    }
});

module.exports = router;