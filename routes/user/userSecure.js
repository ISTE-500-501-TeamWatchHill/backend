const express = require('express');
const router = express.Router();
const { UserInfo, UniversityInfo, TeamInfo, Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const bcrypt = require('bcrypt');
let ObjectId = require("bson-objectid");
const { validateEmail, validateName, validateNonNullNumberID, validatePassword } = require('../auth/validation');

// Get all non-admin users that have allowed marketable emails
router.get('/getMarketable', async (req, res) => {
    try {
        const marketUsers = await UserInfo.find({canMarket: true, roleID: 1234}, {firstName: 1, lastName: 1, universityID: 1, email: 1});

        if (marketUsers.length > 0) {
            res.json(marketUsers);
            res.status(200);
            res.end();
        }
        else {
            res.json({"users": "No Users Found"});
            res.status(204);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

router.post('/getUserProfile', async (req, res) => {
    try {
        const user =  await UserInfo.aggregate([
            {$match: {_id: ObjectId(req.user.user_id)}}, 
            {
                $lookup: {
                    from: "universityInfo",
                    localField: "universityID",
                    foreignField: "universityID",
                    as: "universityInfo"
                }
            },
            {
                $project: {
                    roleID: 1,
                    teamID: 1,
                    universityID: 1,
                    firstName: 1,
                    lastName: 1,
                    email: 1,
                    universityName: "$universityInfo.name"
                }
            }
        ]);
        if (user[0]) {
            res.json(user[0]);
            res.status(200);
            res.end();
        }
        else {
            res.json({"users": "No Users Found"});
            res.status(204);
            res.end();
        }
    }
    catch (err) {
        res.json(err);
        res.status(500);
        res.end();
    }
});

router.put('/updateMarketingPreferences', async (req, res) => {
    try {
        // check and see if the user requesting is an admin, if so check for the included id, otherwise take it right out of the token
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            UserInfo.updateOne({_id: req.body.id}, {canMarket: req.body.canMarket}, function(err, doc) {
                if (err) {
                    res.json({error: err});
                    res.status(500);
                    res.end();
                } 
                res.json({doc});
                res.status(200);
                res.end();
            });
        }
        else {
            UserInfo.updateOne({_id: ObjectId(req.user.id)}, {canMarket: req.body.canMarket}, function(err, doc) {
                if (err) {
                    res.json({error: err});
                    res.status(500);
                    res.end();
                } 
                res.json({doc});
                res.status(200);
                res.end();
            });
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Change user permission definition
router.put('/permission', async (req, res) => {
    try {
        // Make sure requesting user is an admin
        if (req.user.roleID == 14139 || req.user.roleID == 21149) {

            if (req.body.id) {
                const updUser = await UserInfo.findOne({_id: ObjectId(req.body.id)});

                if (updUser) {
                    const updatedData = {
                        roleID: req.body.roleID
                    };

                    UserInfo.updateOne({_id: ObjectId(req.body.id)}, updatedData, function (err, result) {
                        if (err !== null) {
                            res.json(err);
                            res.status(500);
                            res.end();
                        }
                        else {
                            res.json({"_id": _id, "newID": req.body.roleID});
                            res.status(200);
                            res.end();
                        }
                    });
                }
            }
            
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        if (req.body && req.body.firstName && req.body.lastName && req.body.roleID && req.body.email && req.body.password) {
            if (req.user.roleID == 14139 || req.user.roleID == 21149) {
                const { firstName, lastName, roleID, teamID, email, password } = req.body;

                if (!validateName(firstName)) {
                    res.json({ 'error': '`first name` Provided Invalid' });
                    res.status(400);
                    res.end();
                }

                if (!validateName(lastName)) {
                    res.json({ 'error': '`last name` Provided Invalid' });
                    res.status(400);
                    res.end();
                }

                if (!validateNonNullNumberID(roleID)) {
                    res.json({ 'error': '`roleID` Provided Invalid' });
                    res.status(400);
                    res.end();
                }

                if (!validateEmail(email)) {
                    res.json({ 'error': '`email` Provided Invalid' });
                    res.status(400);
                    res.end();
                }

                if (!validatePassword(password)) {
                    res.json({ 'error': '`password` Provided Invalid' });
                    res.status(400);
                    res.end();
                }
                
                //Check to see if user exists (must have unique email)
                const existing = await UserInfo.findOne({email: email});

                if (existing) {
                    res.json({'error': 'Email Provided already exists!'});
                    res.status(400);
                    res.end();
                } else {
                    // email needs to end in an approved domain
                    const emailDomain = email.split('@')[1];
                    const domain = await UniversityInfo.findOne({ 'domain': emailDomain }, {});
                    if (domain) {
                        const { universityID } = domain;

                        //Encrypt user password
                        let hashedPassword = await bcrypt.hash(password, 10);

                        const data = new UserInfo({
                            roleID,
                            teamID, 
                            universityID,
                            firstName,
                            lastName,
                            email,
                            canMarket: false,
                            hashedPassword
                        });
    
                        const inserted = await data.save();
                        const newUser = await UserInfo.findOne({_id: inserted._id});
                        res.json(newUser);
                        res.status(200);
                        res.end();
                    } else {
                        res.json({'error': 'Email Provided does not have a university domain registered in the system! Contact your university for more information.'});
                        res.status(400);
                        res.end();
                    }
                }
            }
            else {
                res.json({'error': "you are not authorized to complete this action"});
                res.status(401);
                res.end();
            }
        }
        else {
            res.json({'error': "missing inputs"});
            res.status(400);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error+""});
        res.status(500);
        res.end();
    }
});

// Update existing user by _id
router.put('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) {
            if (req.body && req.body.id) {
                const updUser = await UserInfo.findOne({_id: ObjectId(req.body.id)});

                if (updUser) {
                    await UserInfo.updateOne({_id: updUser._id}, req.body)
                    .then(async function (data, err){
                        if (updUser.teamID.toString()!==req.body.teamID) {
                            const teamToAdd = async () => {
                                await TeamInfo.updateOne({_id: req.body.teamID}, {$push: {players: updUser._id}});
                            }
                            teamToAdd();
                            if (err) {
                                res.json(err+"");
                                res.status(500);
                                res.end();
                            }
                            else {
                                const updated = await UserInfo.findOne({_id: ObjectId(req.body.id)});
                                res.json({updated});
                                res.status(200);
                                res.end();
                            }  
                        } else {
                            const updated = await UserInfo.findOne({_id: ObjectId(req.body.id)});
                            res.json({updated});
                            res.status(200);
                            res.end();
                        }                      
                    });
                }
                else {
                    res.json({"error": "User Not Found"});
                    res.status(404);
                    res.end();
                }
            }
            else {
                res.json({"error": "Incomplete Input"});
                res.status(400);
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
        res.json({"error": ""+error});
        res.status(500);
        res.end();
    }
});

// Delete user by _id
router.delete('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            try {                
                const userToBeDeleted = await UserInfo.findOne({_id: ObjectId(req.body.id)});
                const teamToBeUpdated = await TeamInfo.updateOne(
                    { _id: ObjectId(userToBeDeleted.teamID) },
                    { $pull: { players: req.body.id } }
                );
                const deleted = await UserInfo.deleteOne({_id: ObjectId(req.body.id)});
                res.json({
                    "Deleted Player": userToBeDeleted
                })
                res.status(200);
                res.end();
            }
            catch (error) {
                res.json({"error": ""+error});
                res.status(500)
                res.end();
            }
        }
        else {
            res.json({'error': "You are not authorized to complete this action"});
            res.status(401);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": ""+error});
        res.status(500);
        res.end();
    }
});

module.exports = router;