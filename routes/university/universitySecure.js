const express = require('express');
const router = express.Router();
const { UniversityInfo } = require('../../model/model');
require('dotenv').config(); //initialize dotenv
let ObjectId = require("bson-objectid");

// Create new university
router.post('/', async (req, res) => {
    if (req.body && req.body.universityID && req.body.domain && req.body.moderatorIDs && req.body.name) {
        if (req.user.roleID == 14139 || req.user.roleID == 21149) {
            const { universityID, domain, moderatorIDs, name } = req.body;
            // Check to see if university exists
            const existing = await UniversityInfo.findOne({universityID}, {_id: 1});

            if (existing) {
                res.status(400).json({'error': 'University ID Provided already exists!'});
            }
            else {
                const data = new UniversityInfo({
                    universityID,
                    domain,
                    moderatorIDs,
                    name,
                    approvalStatus: false
                });

                if (req.body.logo) {
                    // How logo??
                }
                if (req.body.description) {
                    data.description = req.body.description;
                }
                const inserted = await data.save();
                const newUni = await UniversityInfo.findOne({_id: inserted._id});
                res.status(200).json(newUni);
            }
        }
        else {
            res.status(401).json({'error': "you are not authorized to complete this action"});
        }
    }
    else {
        res.status(500).json({'error': "missing inputs"});
    }
});

// Update existing university by _id
router.put('/', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) {
        if (req.body && req.body._id) {
            const updUni = await UniversityInfo.findOne({_id: ObjectId(req.body._id)});
    
            if (updUni) {
                const { updatedData } = req.body;
                await UniversityInfo.updateOne({_id: updUni._id}, updatedData)
                .then(async function (data, err){
                    if (err) {
                        res.status(500).json(err);
                    }
                    else {
                        const updated = await UniversityInfo.findOne({_id: req.body._id});
                        res.status(200).json({updated});
                    }
                });
            }
            else {
                res.status(404).json({"error": "University Not Found"});
            }
        }
        else {
            res.status(404).json({"error": "Incomplete Input"});
        }
    }
    else {
        res.status(401).json({'error': "you are not authorized to complete this action"});
    }
});

// Delete university by _id
router.delete('/', async (req, res) => {
    if (req.user.roleID == 14139 || req.user.roleID == 21149) { // uni admin or company admin
        try {
            const deleted = await UniversityInfo.deleteOne({_id: req.body._id});
            res.status(200).json(deleted);
        }
        catch (error) {
            res.status(500).json({"error": error});
        }
    }
    else {
        res.status(401).json({'error': "you are not authorized to complete this action"});
    }
});

module.exports = router;