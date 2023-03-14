const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId

const gameInfoSchema = new mongoose.Schema({
    gameID: {
        required: true,
        type: Number
    },
    universityID: {
        required: true,
        type: Number
    },
    homeTeam: {
        required: true,
        type: Number
    },
    awayTeam: {
        required: true,
        type: Number
    },
    winningTeam: {
        required: true,
        type: Number
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

const permissionsSchema = new mongoose.Schema({
    permissionCode: {
        required: true,
        type: Number
    },
    permissionDescription: {
        required: true,
        type: String
    }
}, {collection: "permissions"});

const teamInfoSchema = new mongoose.Schema({
    universityID: {
        required: true,
        type: Number
    },
    players: {
        userID: {
            required: true,
            type: Number
        }
    },
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
    moderatorIDs: {
        userID: {
            required: true,
            type: Number
        }
    },
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
    uid: {
        required: true,
        type: Number
    },
    roleID: {
        required: true,
        type: Number
    },
    universityID: {
        required: true,
        type: Number
    },
    teamID: {
        required: false,
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
    hashedPassword: {
        required: true,
        type: String
    }
}, {collection: "userInfo"});

const GameInfo = mongoose.model('gameInfo', gameInfoSchema);
const Permissions = mongoose.model('permissions', permissionsSchema);
const TeamInfo = mongoose.model('teamInfo', teamInfoSchema);
const UniversityInfo = mongoose.model('universityInfo', universityInfoSchema);
const UserInfo = mongoose.model('userInfo', userInfoSchema);

module.exports = {GameInfo, Permissions, TeamInfo, UniversityInfo, UserInfo};