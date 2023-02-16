const express = require('express');
const router = express.Router();
const { TeamInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all team information by id
router.get('/all', async (req, res) => {
    const teams = await TeamInfo.find({});
    if (teams === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(teams);
    }
});

// Get all team information by id
router.get('/byID', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const team = await TeamInfo.findOne({"_id": ObjectId(req.body.id)});
        if (team === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(team);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

module.exports = router;