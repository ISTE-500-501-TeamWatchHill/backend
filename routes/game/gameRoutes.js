const express = require('express');
const router = express.Router();
const { GameInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all game information by id
router.get('/byID', async (req, res) => {
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

// Get all game information
router.get('/all', async (req, res) => {
    const game = await GameInfo.find({});
    if (game === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(game);
    }
});

// Update game information
router.put('/', async (req, res) => {

});

// Create new game
router.post('/', async (req, res) => {

});

module.exports = router;