const express = require('express');
const router = express.Router();
const { Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all permission information by id
router.get('/', async (req, res) => {
    const permissions = await Permissions.find({});
    if (permissions === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(permissions);
    }
});

module.exports = router;