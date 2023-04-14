const { default: ObjectID } = require('bson-objectid');
const mongoose = require('mongoose');

const gameInfoSchema = new mongoose.Schema({
    universityID: {
        required: true,
        type: Number
    },
    homeTeam: {
        required: true,
        type: ObjectID
    },
    awayTeam: {
        required: true,
        type: ObjectID
    },
    winningTeam: {
        required: false,
        type: ObjectID
    },
    gameFinished: {
        required: false,
        type: Boolean
    },
    gameTime: {
        required: false,
        type: Date
    }
}, {collection: "gameInfo"});

const teamInfoSchema = new mongoose.Schema({
    universityID: {
        required: true,
        type: Number
    },
    players: [ ObjectID ],
    description: {
        required: false,
        type: String
    },
    logo: {
        required: false,
        type: String
    },
    approvalStatus: {
        required: false,
        type: Boolean,
        default: false
    }
}, {collection: "teamInfo"});

const universityInfoSchema = new mongoose.Schema({
    universityID: {
        required: true,
        type: Number
    },
    domain: {
        required: true,
        type: String
    },
    moderatorIDs: [ ObjectID ],
    name: {
        required: true, 
        type: String
    },
    logo: {
        required: false,
        type: String
    },
    description: {
        required: false,
        type: String
    },
    approvalStatus: {
        required: false,
        type: Boolean,
        default: false
    }
}, {collection: "universityInfo"});

const userInfoSchema = new mongoose.Schema({
    roleID: {
        required: true,
        type: Number
    },
    teamID: {
        required: false,
        type: ObjectID
    },
    universityID: {
        required: true,
        type: Number
    },
    firstName: {
        required: true,
        type: String
    },
    lastName: {
        required: true,
        type: String
    },
    email: {
        required: true,
        type: String
    },
    canMarket: {
        required: true,
        type: Boolean,
        default: false
    },
    hashedPassword: {
        required: true,
        type: String
    }
}, {collection: "userInfo"});

const GameInfo = mongoose.model('gameInfo', gameInfoSchema);
const TeamInfo = mongoose.model('teamInfo', teamInfoSchema);
const UniversityInfo = mongoose.model('universityInfo', universityInfoSchema);
const UserInfo = mongoose.model('userInfo', userInfoSchema);

module.exports = {GameInfo, TeamInfo, UniversityInfo, UserInfo};