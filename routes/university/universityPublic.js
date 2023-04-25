const express = require('express');
const router = express.Router();
const { UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID, validateNonNullStringHashID } = require('../auth/validation');

// Get all university information
router.get('/all', async (req, res) => {
    try {
        const unis = await UniversityInfo.find({});
        if (unis === null) {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(unis);
            res.status(200);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Get all unapproved universities
router.get('/unapproved', async (req, res) => {
    try {
        const unis = await UniversityInfo.find({approvalStatus: false});
        if (unis === null) {
            res.json({'error': 'No Data Found'});
            res.status(400);
            res.end();
        }
        else {
            res.json(unis);
            res.status(200);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Get all university information by _id
router.post('/byID', async (req, res) => {
    try {
        if (req.body && req.body._id) {
            if (!validateNonNullStringHashID(req.body.id)) {
                res.json({ 'error': '`id` Provided Invalid' });
                res.status(403);
                res.end();
            }
            const uni = await UniversityInfo.findOne({_id: req.body.id});
            if (uni === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(uni);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain id'});
            res.status(400);
            res.end();
        }
    }
    catch (error) {
        res.json({"error": error});
        res.status(500);
        res.end();
    }
});

// Get all university information by University id
router.post('/byUniversityID', async (req, res) => {
    try {
        if (req.body && req.body.universityID) {
            if (!validateNonNullNumberID(req.body.universityID)) {
                res.json({ 'error': 'University ID Provided Invalid' });
                res.status(403);
                res.end();
            }
            const uni = await UniversityInfo.findOne({"universityID": req.body.universityID});
            if (uni === null) {
                res.json({'error': 'No Data Found'});
                res.status(400);
                res.end();
            }
            else {
                res.json(uni);
                res.status(200);
                res.end();
            }
        }
        else {
            res.json({'error': 'Request must contain university ID'});
            res.status(400);
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