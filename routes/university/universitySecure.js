const express = require('express');
const router = express.Router();
const { UniversityInfo, TeamInfo, UserInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID, validateName, validateNonNullStringHashID } = require('../auth/validation');

// Create new university
router.post('/', async (req, res) => {
    try {
        if (req.body && req.body.universityID && req.body.domain && req.body.moderatorIDs && req.body.name) {
            if (req.user.roleID == 14139 || req.user.roleID == 21149) {
                const { universityID, domain, moderatorIDs, name } = req.body;
                if (!validateNonNullNumberID(universityID)) {
                    res.json({ 'error': '`universityID` Provided Invalid' });
                    res.status(403);
                    res.end();
                }

                if (!validateName(name)) {
                    res.json({ 'error': '`name` Provided Invalid' });
                    res.status(403);
                    res.end();
                }
                
                // Check to see if university exists
                const existing = await UniversityInfo.findOne({universityID}, {_id: 1});

                if (existing) {
                    res.status(400).json({'error': 'University ID Provided already exists!'});
                }
                else {
                    const data = new UniversityInfo({
                        universityID,
                        domain,
                        moderatorIDs,
                        name,
                        approvalStatus: false
                    });

                    if (req.body.description) {
                        data.description = req.body.description;
                    }
                    const inserted = await data.save();
                    const newUni = await UniversityInfo.findOne({_id: inserted._id});
                    res.json(newUni);
                    res.status(200);
                    res.end();
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

// Update existing university by _id
router.put('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) {
            if (req.body && req.body.id) {
                if (!validateNonNullStringHashID(req.body.id)) {
                    res.json({ 'error': '`_id` Provided Invalid' });
                    res.status(403);
                    res.end();
                }
                if (req.body.universityID) {
                    res.json({ 'error': 'Not Allowed to update university ID' });
                    res.status(400);
                    res.end();
                }
                const updUni = await UniversityInfo.findOne({_id: ObjectId(req.body.id)});
        
                if (updUni) {
                    await UniversityInfo.updateOne({_id: updUni._id}, req.body)
                    .then(async function (data, err){
                        if (err) {
                            res.json(err);
                            res.status(500);
                            res.end();
                        }
                        else {
                            const updated = await UniversityInfo.findOne({_id: req.body.id});
                            res.json({updated});
                            res.status(200);
                            res.end();
                        }
                    });
                }
                else {
                    res.json({"error": "University Not Found"});
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
        else {
            res.status(401).json({'error': "you are not authorized to complete this action"});
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Delete university by _id
router.delete('/', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
            if (!validateNonNullNumberID(req.body.id)) {
                res.json({ 'error': '`id` Provided Invalid' });
                res.status(403);
                res.end();
            }
            try {
                const deleted = await UniversityInfo.deleteOne({universityID: req.body.id});
                //delete all teams with this id, delete all users with this id 
                const deleteTeamsAndUsers = async () => {
                    const teams = await TeamInfo.deleteMany({universityID: req.body.id});
                    const users = await UserInfo.deleteMany({universityID: req.body.id});
                }
                deleteTeamsAndUsers();
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