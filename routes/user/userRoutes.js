const express = require('express');
const router = express.Router();
const { UserInfo, Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Get all user information by id without password
router.get('/', async (req, res) => {
    // Error Checking
    if (req.body && req.body.id) {
        const user = await UserInfo.findOne({"_id": ObjectId(req.body.id)}, {hashedPassword: 0});
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

// Get all non-admin users that have allowed marketable emails
router.get('/getMarketable', async (req, res) => {
    const marketUsers = await UserInfo.find({canMarket: true, roleID: 1234}, {firstName: 1, lastName: 1, universityID: 1, email: 1});

    if (marketUsers.length > 0) {
        res.status(200).json(marketUsers);
    }
    else {
        res.status(204).json({"users": "No Users Found"});
    }
});

router.put('/updateMarketingPreferences', async (req, res) => {
    // fix these damn conditionals they literally do not work
    // check and see if the user requesting is an admin, if so check for the included id or uid.. otherwise take it right out of the token

    if (req.user.roleID == 4444 || req.user.roleID == 1111) { // uni admin or company admin
        UserInfo.findOneAndUpdate({uid: req.body.uid}, {canMarket: req.body.canMarket}, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.status(200).json({'success': 'Successfully saved.'});
        });
    }
    else {
        UserInfo.findOneAndUpdate({_id: ObjectId(req.user._id)}, {canMarket: req.body.canMarket}, {upsert: true}, function(err, doc) {
            if (err) return res.send(500, {error: err});
            return res.status(200).json({'success': 'Successfully saved.'});
        });
    }
    // else {
    //     // todo: lets check on these status codes...
    //     console.log(req.body.uid, req.body._id, req.body.canMarket);
    //     res.status(500).json({"error": "Missing Inputs"});
    // }
});

// Get all users that are not verified
router.get('/unverified', async (req, res) => {
    // Error Checking
    const users = await UserInfo.findMany({}, {hashedPassword: 0});
});

// Change user permission definition
router.put('/permission', async (req, res) => {
    // Make sure requesting user is an admin
    const reqUser = await UserInfo.findOne({_id: ObjectId(req.user.user_id)}, {roleID: 1});

    if (reqUser && reqUser.roleID && reqUser.roleID == 1234 || reqUser.roleID == 2468) {
        console.log('success');

        if (req.body.uid) {
            const updUser = await UserInfo.findOne({_id: ObjectId(req.body.uid)});

            if (updUser) {
                const updatedData = {
                    roleID: req.body.roleID
                };

                UserInfo.updateOne({_id: ObjectId(req.body.uid)}, updatedData, function (err, result) {
                    if (err !== null) {
                        res.status(500).json(err);
                    }
                    else {
                        res.status(200).json({"_id": id, "newID": req.body.roleID});
                    }
                });
            }
        }
        
    }
});

module.exports = router;