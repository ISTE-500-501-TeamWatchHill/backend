const express = require('express');
const router = express.Router();
const { Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all permission information by id
router.get('/', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const permission = await Permissions.findOne({"_id": ObjectId(req.body.id)});
        if (permission === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(permission);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain university ID'});
    }
});

module.exports = router;