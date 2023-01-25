import * as dotenv from 'dotenv'
dotenv.config()

// Connect to DB and create global var
// Do NOT save this file with your credentials inside
let userName = ``;
let userPass = ``;
let db = connect(`mongodb+srv://${dotenv.USER}:${dotenv.PASSWORD}@cluster0.q3cfthr.mongodb.net/test`)

// Create universityInfo collection and add data
db.universityInfo.insertMany(
    {
        "universityID": 2760,
        "moderatorIDs": [],
        "name": "Rochester Institute of Technology",
        "logo": "",
        "description": "Rochester Institute of Technology",
        "approvalStatus": true
    },
    {
        "universityID": 2928,
        "moderatorIDs": [],
        "name": "University of Rochester",
        "logo": "",
        "description": "University of Rochester",
        "approvalStatus": false
    },
    {
        "universityID": 2429,
        "moderatorIDs": [],
        "name": "Monroe Community College",
        "logo": "",
        "description": "Monroe Community College",
        "approvalStatus": false
    }
);

// Create userInfo collection and add data
db.userInfo.insertMany(
    {
        "uid": 123456789,
        "roleID": 10010,
        "universityID": 2760,
        "teamID": null,
        "firstName": "John",
        "lastName": "Doe",
        "email": "jfd1234@rit.edu",
        "hashedPassword": null
    },
    {
        "uid": 101112131,
        "roleID": 110110,
        "universityID": 2928,
        "teamID": null,
        "firstName": "Jane",
        "lastName": "Doe",
        "email": "jrd5678@ur.rochester.edu",
        "hashedPassword": null
    },
    {
        "uid": 415161718,
        "roleID": 101001,
        "universityID": 2429,
        "teamID": null,
        "firstName": "Richard",
        "lastName": "Johnson",
        "email": "rdj9101@student.monroecc.edu",
        "hashedPassword": null
    }
);

// Create teamInfo collection and add data
db.teamInfo.insertMany(
    {
        "teamID": 123421,
        "universityID": 2760,
        "players": [],
        "description": "Sample RIT Team 1",
        "logo": "",
        "approvalStatus": true,
    },
    {
        "teamID": 475126575,
        "universityID": 2760,
        "players": [],
        "description": "Sample RIT Team 2",
        "logo": "",
        "approvalStatus": true,
    },
    {
        "teamID": 2815512,
        "universityID": 2928,
        "players": [],
        "description": "Sample UoR Team",
        "logo": "",
        "approvalStatus": false,
    },
    {
        "teamID": 27422978,
        "universityID": 2429,
        "players": [],
        "description": "Sample MCC Team",
        "logo": "",
        "approvalStatus": false,
    }
);

// Create gameInfo collection and add data
db.gameInfo.insertMany(
    {
        "gameID": 8526845,
        "universityID": 2760,
        "homeTeam": 1223421,
        "awayTeam": 475126575,
        "winningTeam": 1223421,
        "gameFinished": true,
        "gameTime": "2014-01-22T14:56:59.301Z"
    }
);

// Create permissions collection and add data
db.permissions.insertMany(
    {
        "permissionCode": 1101011101,
        "permissionDescription": "University Moderator"
    },
    {
        "permissionCode": 1000101101101,
        "permissionDescription": "Game Moderator"
    }
);