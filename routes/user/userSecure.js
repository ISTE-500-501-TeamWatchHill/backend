const express = require('express');
const router = express.Router();
const { UserInfo, Permissions } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

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
    // check and see if the user requesting is an admin, if so check for the included id or uid.. otherwise take it right out of the token
    if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
        UserInfo.updateOne({uid: req.body.uid}, {canMarket: req.body.canMarket}, function(err, doc) {
            if (err) return res.status(500).json({error: err});
            return res.status(200).json({doc});
        });
    }
    else {
        UserInfo.updateOne({_id: ObjectId(req.user._id)}, {canMarket: req.body.canMarket}, function(err, doc) {
            if (err) return res.status(500).json({error: err});
            return res.status(200).json({doc});
        });
    }
});

// Change user permission definition
router.put('/permission', async (req, res) => {
    // Make sure requesting user is an admin
    if (req.user.roleID == 14139 || req.user.roleID == 21149) {

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