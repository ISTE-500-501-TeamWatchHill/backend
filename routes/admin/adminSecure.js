const express = require('express');
const router = express.Router();
const { UserInfo, TeamInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require("bson-objectid");
const { validateNonNullStringHashID } = require('../auth/validation');

// Get Unverified Teams
router.get('/teams', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) {
        const unverifiedTeams = await TeamInfo.find({approvalStatus: false});

        if (unverifiedTeams) {
            res.status(200).json(unverifiedTeams);
        }
        else {
            return res.status(400).json({'error': 'No Data Found'});
        }
    }
    else {
        res.status(401).json({'error': "you are not authorized to complete this action"});
    }
});

// Verify Team By ID
router.put('/teams', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149 && req.body._id.length > 0 && req.body._id.length == 24) {
            TeamInfo.updateOne({_id: req.body._id}, {$set: {approvalStatus: true}}, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({result});
                }
            });
        }
        else {
            res.status(401).json({'error': "you are not authorized to complete this action"});
        }
    }
    catch (error) {
        res.status(500).json({"error": error});
    }
});

// Get Unverified Universities
router.get('/universities', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) {
            const unverifiedTeams = await UniversityInfo.find({approvalStatus: false});
    
            if (unverifiedTeams) {
                res.status(200).json(unverifiedTeams);
            }
            else {
                return res.status(400).json({'error': 'No Data Found'});
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

// Verify University By ID
router.put('/universities', async (req, res) => {
    try {
        if (req.user.roleID == 14139 || req.user.roleID == 21149 && req.body._id.length > 0 && req.body._id.length == 24) {
            UniversityInfo.updateOne({_id: req.body._id}, {$set: {approvalStatus: true}}, function (err, result) {
                if (err !== null) {
                    res.status(500).json(err);
                }
                else {
                    res.status(200).json({result});
                }
            });
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