const express = require('express');
const router = express.Router();
const { UserInfo, TeamInfo, UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv

// Get Unverified Teams
router.get('/teams', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) {
        const unverifiedTeams = await TeamInfo.find({approvalStatus: false});

        if (unverifiedTeams) {
            res.json(unverifiedTeams);
            res.status(200);
            res.end();
        }
        else {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
    }
    else {
        res.json({'error': "you are not authorized to complete this action"});
        res.status(401);
        res.end();
    }
});

// Verify Team By ID
router.put('/teams', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149 && req.body._id.length > 0) {
        TeamInfo.updateOne({_id: req.body.id}, {$set: {approvalStatus: true}}, function (err, result) {
            if (err !== null) {
                res.json(err);
                res.status(500);
                res.end();
            }
            else {
                res.json({result});
                res.status(200);
                res.end();
            }
        });
    }
    else {
        res.json({'error': "you are not authorized to complete this action"});
        res.status(401);
        res.end();
    }
});

// Get Unverified Universities
router.get('/universities', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) {
        const unverifiedTeams = await UniversityInfo.find({approvalStatus: false});

        if (unverifiedTeams) {
            res.json(unverifiedTeams);
            res.status(200);
            res.end();
        }
        else {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
    }
    else {
        res.json({'error': "you are not authorized to complete this action"});
        res.status(401);
        res.end();
    }
});

// Verify University By ID
router.put('/universities', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149 && req.body._id.length > 0) {
        UniversityInfo.updateOne({_id: req.body.id}, {$set: {approvalStatus: true}}, function (err, result) {
            if (err !== null) {
                res.json(err);
                res.status(500);
                res.end();
            }
            else {
                res.status(200).json({result});
            }
        });
    }
    else {
        res.json({'error': "you are not authorized to complete this action"});
        res.status(401);
        res.end();
    }
});

module.exports = router;