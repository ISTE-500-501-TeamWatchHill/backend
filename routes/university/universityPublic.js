const express = require('express');
const router = express.Router();
const { UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID } = require('../auth/validation');

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

// Get all university information by id
router.post('/byID', async (req, res) => {
    if (!validateNonNullNumberID(universityID)) {
        res.status(400).json({ 'error': 'University ID Provided Invalid' });
    }
    if (req.body && req.body.universityID) {
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