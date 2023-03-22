const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
const ObjectId = require("bson-objectid");
const { validateNonNullStringHashID } = require('../auth/validation');

// Get all game information by id
router.post('/byID', async (req, res) => {
    if (req.body && req.body.id) {
        if (!validateNonNullStringHashID(req.body.id)){
            return res.status(403).json({'error': 'Game ID provided invalid'});
        }
        const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
        if (game === null) {
            return res.status(400).json({'error': 'No Data Found'});
        }
        else {
            return res.status(200).json(game);
        }
    }
    else {
        return res.status(400).json({'error': 'Request must contain game ID'});
    }
});

// Get all game information
router.get('/all', async (req, res) => {
    const game = await GameInfo.find({});
    if (game === null) {
        return res.status(400).json({'error': 'No Data Found'});
    }
    else {
        return res.status(200).json(game);
    }
});

module.exports = router;