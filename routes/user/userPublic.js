const express = require('express');
const router = express.Router();
const { UserInfo, Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");
const { validateNonNullNumberID, validateNonNullStringHashID } = require('../auth/validation');

// Get all user information by id without password
router.post('/byID', async (req, res) => {
    if (req.body && req.body.id) {
        if (!validateNonNullStringHashID(req.body.id)) {
            res.status(400).json({'error': 'User `_id` Provided Invalid'});
        }
        // Does the line below actually work?
        const user = await UserInfo.findOne({"_id": ObjectId(req.body.id)}, {hashedPassword: 0});
        if (user === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(user);
        }
    }
    else if (req.body && req.body.uid) {
        if (!validateNonNullNumberID(req.body.uid)) {
            res.status(400).json({'error': '`uid` Provided Invalid'});
        }
        const user = await UserInfo.findOne({"uid": req.body.uid}, {hashedPassword: 0});
        if (user === null) {
            res.status(400).json({'error': 'No Data Found'});
        }
        else {
            res.status(200).json(user);
        }
    }
    else {
        res.status(400).json({'error': 'Request must contain user ID'})
    }
});

// Get all user information by id without password
router.get('/all', async (req, res) => {
    const user = await UserInfo.find({}, {hashedPassword: 0});
    if (user === null) {
        res.status(400).json({'error': 'No Data Found'});
    }
    else {
        res.status(200).json(user);
    }
});

module.exports = router;