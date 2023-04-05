const express = require('express');
const router = express.Router();
const { UserInfo, UniversityInfo, Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const bcrypt = require('bcrypt');
let ObjectId = require("bson-objectid");
const { validateEmail, validateName, validateNonNullNumberID, validatePassword } = require('../auth/validation');

// Get all non-admin users that have allowed marketable emails
router.get('/getMarketable', async (req, res) => {
    try {
        const marketUsers = await UserInfo.find({canMarket: true, roleID: 1234}, {firstName: 1, lastName: 1, universityID: 1, email: 1});

        if (marketUsers.length > 0) {
            res.status(200).json(marketUsers);
        }
        else {
            res.status(204).json({"users": "No Users Found"});
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

router.post('/getUserProfile', async (req, res) => {
    try {
        const user = await UserInfo.findOne({_id: req.user.user_id}, {hashedPassword: 0, __v: 0});

        if (user) {
            res.status(200).json(user);
        }
        else {
            res.status(204).json({"users": "No Users Found"});
        }
    }
    catch (err) {
        res.status(500).json(err);
    }
});

router.put('/updateMarketingPreferences', async (req, res) => {
    try {
        // check and see if the user requesting is an admin, if so check for the included id, otherwise take it right out of the token
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            UserInfo.updateOne({_id: req.body.id}, {canMarket: req.body.canMarket}, function(err, doc) {
                if (err) return res.status(500).json({error: err});
                return res.status(200).json({doc});
            });
        }
        else {
            UserInfo.updateOne({_id: ObjectId(req.user._id)}, {canMarket: req.body.canMarket}, function(err, doc) {
                if (err) return res.status(500).json({error: err});
                return res.status(200).json({doc});
            });
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
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
                            res.status(500).json(err);
                        }
                        else {
                            res.status(200).json({"_id": _id, "newID": req.body.roleID});
                        }
                    });
                }
            }
            
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Create new user
router.post('/', async (req, res) => {
    try {
        if (req.body && req.body.firstName && req.body.lastName && req.body.roleID && req.body.email && req.body.password) {
            if (req.user.roleID == 14139 || req.user.roleID == 21149) {
                console.log(req.body);
                const { firstName, lastName, roleID, email, password } = req.body;

                if (!validateName(firstName)) {
                    return res.status(403).json({ 'error': '`first name` Provided Invalid' });
                }

                if (!validateName(lastName)) {
                    return res.status(403).json({ 'error': '`last name` Provided Invalid' });
                }

                if (!validateNonNullNumberID(roleID)) {
                    return res.status(403).json({ 'error': '`roleID` Provided Invalid' });
                }

                if (!validateEmail(email)) {
                    return res.status(403).json({ 'error': '`email` Provided Invalid' });
                }

                if (!validatePassword(password)) {
                    return res.status(403).json({ 'error': '`password` Provided Invalid' });
                }
                
                //Check to see if user exists (must have unique email)
                const existing = await UserInfo.findOne({email: email});

                console.log("Successful attempt to find matching user");

                if (existing) {
                    res.status(400).json({'error': 'Email Provided already exists!'});
                } else {
                    console.log("EMail is unique");
                    // email needs to end in an approved domain
                    const emailDomain = email.split('@')[1];
                    const domain = await UniversityInfo.findOne({ 'domain': emailDomain }, {});
                    if (domain) {
                        const { universityID } = domain;
                        console.log(universityID);

                        //Encrypt user password
                        let hashedPassword = await bcrypt.hash(password, 10);

                        const data = new UserInfo({
                            roleID,
                            universityID,
                            firstName,
                            lastName,
                            email,
                            canMarket: false,
                            hashedPassword
                        });
    
                        const inserted = await data.save();
                        const newUser = await UserInfo.findOne({_id: inserted._id});
                        res.status(200).json(newUser);
                    } else {
                        res.status(400).json({'error': 'Email Provided does not have a university domain registered in the system! Contact your university for more information.'});
                    }
                }
            }
            else {
                res.status(401).json({'error': "you are not authorized to complete this action"});
            }
        }
        else {
            console.log("CRAP");
            res.status(500).json({'error': "missing inputs"});
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
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
                        if (err) {
                            res.status(500).json(err);
                        }
                        else {
                            const updated = await UserInfo.findOne({_id: req.body.id});
                            res.status(200).json({updated});
                        }
                    });
                }
                else {
                    res.status(404).json({"error": "User Not Found"});
                }
            }
            else {
                res.status(404).json({"error": "Incomplete Input"});
            }
        }
        else {
            res.status(401).json({'error': "you are not authorized to complete this action"});
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

module.exports = router;