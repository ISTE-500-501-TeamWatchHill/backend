const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all game information by id
router.get('/', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const game = await GameInfo.findOne({"_id": ObjectId(req.body.id)});
        if (game === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(game);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

module.exports = router;