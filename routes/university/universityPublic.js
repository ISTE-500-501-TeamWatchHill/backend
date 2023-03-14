const express = require('express');
const router = express.Router();
const { UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all university information
router.get('/all', async (req, res) => {
    // Error Checking
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
    // Error Checking
    if (req.body && req.body.id) {
        const uni = await UniversityInfo.findOne({"_id": ObjectId(req.body.id)});
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