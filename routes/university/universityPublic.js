const express = require('express');
const router = express.Router();
const { UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID, validateNonNullStringHashID } = require('../auth/validation');

// Get all university information
router.get('/all', async (req, res) => {
    const unis = await UniversityInfo.find({});
    if (unis === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(unis);
    }
});

// Get all unapproved universities
router.get('/unapproved', async (req, res) => {
    const unis = await UniversityInfo.find({approvalStatus: false});
    if (unis === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(unis);
    }
});

// Get all university information by _id
router.post('/byID', async (req, res) => {
    if (req.body && req.body._id) {
        if (!validateNonNullStringHashID(req.body.id)) {
            return res.status(403).json({ 'error': '`id` Provided Invalid' });
        }
        const uni = await UniversityInfo.findOne({_id: req.body.id});
        if (uni === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(uni);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain id'});
    }
});

// Get all university information by University id
router.post('/byUniversityID', async (req, res) => {
    if (req.body && req.body.universityID) {
        if (!validateNonNullNumberID(req.body.universityID)) {
            return res.status(403).json({ 'error': 'University ID Provided Invalid' });
        }
        const uni = await UniversityInfo.findOne({"universityID": req.body.universityID});
        if (uni === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(uni);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

module.exports = router;