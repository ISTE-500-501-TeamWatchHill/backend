# BoardGameProject

## Set up
##### Clone Repo
```
git clone https://github.com/ISTE-500-501-TeamWatchHill/backend.git && cd ./backend
```

##### Set up config and credentials
```
cp ./.env.example ./.env
```

Also, message Aidan, Vicky, Alexis, or Aaron for credential information. PORT=#### needs to match `REACT_APP_BASE_URL`'s port on the frontend repo. Default is 5000.

##### Run app
```
npm start
```

##### Run tests
```
jest
```
##### Common issues:
```
command not found: jest
run npm install -g jest
```

## User Permission Integers:
* Superadmin: 14139
* University Admin: 21149
* Content Moderator: 31514
* Student / Team Member (General User): 19202

## Endpoints

### Authorization:
#### Register:
* Endpoint: {{host}}/register
* Method Type: POST
* Authorization: None
* Request Body:
    ```
    {
        "firstName": "Your First Name", (String)
        "lastName": "Your Last Name", (String)
        "email": "YourEmail@approved.domain", (String)
        "password": "YourPassword123!" (String)
    }
    ```
* Response Body:
    ```
    {
        "token": "Your Individual User Authorization Token - MUST BE USED FOR All OTHER CALLS BESIDES LOGIN AND REGISTER"
    }
    ```

#### Login: 
* Endpoint: {{host}}/login
* Method Type: POST
* Authorization: None
* Request Body:
    ```
    {
        "email": "YourEmail@approved.domain",
        "password": "YourPassword123!"
    }
    ```
* Response Body:
    ```
    {
        "token": "Your Individual User Authorization Token - MUST BE USED FOR All OTHER CALLS BESIDES LOGIN AND REGISTER"
    }
    ```

### Admin (Secure):
#### getAllUnverifiedTeams
* Endpoint: {{host}}/admin/teams
* Method Type: GET
* Authorization: Header Token, Company Admin
* Request Body:
```
{

}
```
* Response Body:
```
{
    [  
        {
            "_id": [String, mongo doc ID],
            "teamID": [Integer, team ID],
            "universityID": [Integer, university ID that team belongs to],
            "players": [String array, mongo doc IDs of users in this team],
            "description": [String, team description],
            "logo": [In Progress],
            "approvalStatus": [Boolean, whether or not the team has been approved]
        },
        {
            Repeat for as many records exist
        }
    ]
}
```
#### verifyTeamByID
* Endpoint: {{host}}/admin/teams
* Method Type: PUT
* Authorization: Header Token, Company Admin
* Request Body:
```
{
    _id: [String, mongo doc ID of team to be verified]
}
```
* Response Body:
```
{
    "result": {
        "acknowledged": [Boolean, whether or not the DB recieved your request],
        "modifiedCount": [Integer, how many documents were updated],
        "upsertedId": [String, mongo doc ID of upserted record (if exists)],
        "upsertedCount": [Integer, how many records were upserted],
        "matchedCount": [Integer, how many records were matched]
    }
}
```
#### getAllUnverifiedUniversities
* Endpoint: {{host}}/admin/universities
* Method Type: GET
* Authorization: Header Token, Company Admin
* Request Body:
```
{

}
```
* Response Body:
```
{
    [
        {
            "_id": [String, team mongo doc ID],
            "universityID": [Integer, university ETS code],
            "moderatorIDs": [String Array, mongo doc IDs of users who are moderators for this university],
            "name": [String, university name],
            "logo": [In Progress],
            "description": [String, description of university],
            "approvalStatus": [Boolean, whether or not the university has moderator approval],
            "domain": [String, the universities email domain]
        },
        {
            Repeat for as many records exist
        }
    ]
}
```
#### verifyUniversityByID
* Endpoint: {{host}}/admin/universities
* Method Type: PUT
* Authorization: Header Token, Company Admin
* Request Body:
```
{
    _id: [String, mongo doc ID of university to be verified]
}
```
* Response Body:
```
{
    "result": {
        "acknowledged": [Boolean, whether or not the DB recieved your request],
        "modifiedCount": [Integer, how many documents were updated],
        "upsertedId": [String, mongo doc ID of upserted record (if exists)],
        "upsertedCount": [Integer, how many records were upserted],
        "matchedCount": [Integer, how many records were matched]
    }
}
```

### Games (Public):
#### getAllGames
* Endpoint: {{host}}/gamePub/all
* Method Type: GET
* Authorization: None
* Request Body:
```
{

}
```
* Response Body:
```
[
    {
        "_id": "[String, game mongo doc ID]",
        "gameID": [Integer, ID of game],
        "universityID": [Integer, ID of university where game is being played],
        "homeTeam": [Integer, ID of home team],
        "awayTeam": [Integer, ID of away team],
        "winningTeam": [Integer, ID (if any) of winning team],
        "gameFinished": [Boolean, whether or not the game has finished],
        "gameTime": "[Datetime, stamp of last update to the game]"
    },
    {
        Same as above, repeat for as many records as are available
    }
]
```
#### getGameByID
* Endpoint: {{host}}/gamePub/byID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    "id": "[String, game mongo doc ID]"
}
```
* Response Body:
```
{
    "_id": "[String, game mongo doc ID]",
    "gameID": [Integer, ID of game],
    "universityID": [Integer, ID of university where game is being played],
    "homeTeam": [Integer, ID of home team],
    "awayTeam": [Integer, ID of away team],
    "winningTeam": [Integer, ID (if any) of winning team],
    "gameFinished": [Boolean, whether or not the game has finished],
    "gameTime": "[Datetime, stamp of last update to the game]"
}
```

### Games (Secure):
#### updateGameInfo
* Endpoint: {{host}}/gameSec
* Method Type: PUT
* Authorization: Header Token
* Request Body:
```
{
    id: [String, games mongo doc ID],
    updatedData: {
        <!-- Only include data here that should be updated! Options Include: -->
        "universityID": [Integer, ID of university where game is being played],
        "homeTeam": [Integer, ID of home team],
        "awayTeam": [Integer, ID of away team],
        "winningTeam": [Integer, ID (if any) of winning team],
        "gameFinished": [Boolean, whether or not the game has finished],
        "gameTime": "[Datetime, when the game started or finished]"
    }
}
    
```
* Response Body:
```
{
    "result": {
        "acknowledged": [Boolean, whether or not the update passed],
        "modifiedCount": [Integer, Number of Documents Modified],
        "upsertedId": [String, ID of new record if upserted],
        "upsertedCount": [Integer, Number of records upserted],
        "matchedCount": [Integer, How many records matched the original query]
    }
}
```
#### createNewGame
* Endpoint: {{host}}/gameSec
* Method Type: POST
* Authorization: Header Token
* Request Body:
```
{
    "universityID": [Integer, ID of university],
    "homeTeam": [String, mongo doc ID of home team],
    "awayTeam": [String, mongo doc ID of away team]
}
```
* Response Body:
```
{
    "_id": [String, mongo doc ID of game],
    "universityID": [Integer, id of university],
    "homeTeam": [String, mongo doc ID of home team],
    "awayTeam": [String, mongo doc ID of away team]
    "winningTeam": [String (Null on insert), mongo doc ID of winning team],
    "gameFinished": [Boolean, whether or not the game is finished],
    "gameTime": [Datetime, when the game started or finished],
    "__v": 0
}
```
#### deleteGame
* Endpoint: {{host}}/gameSec
* Method Type: DELETE
* Authorization: Header Token, University or Company Admin
* Request Body:
```
{
    id: [String, games mongo doc ID]
}
```
* Response Body:
```
{
    "acknowledged": [Boolean, whether or not the request was processed],
    "deletedCount": [Integer, how many documents were matched and deleted]
}
```
### Universities (Public):
#### getAllUniversities
* Endpoint: {{host}}/universityPub/all
* Method Type: GET
* Authorization: None
* Request Body:
```
```
* Response Body:
```
[
    {
        "_id": [String, mongo doc ID],
        "universityID": [Integer, University ETS Code],
        "domain": [String, universities email domain],
        "moderatorIDs": [
            [Strings, mongo doc IDs of moderator users for this university]
        ],
        "name": [String, university name],
        "description": [String, university description],
        "logo": [IN PROGRESS]
    },
    {
        Same as above, repeat for as many records as are available
    }
]
```
#### getUniversityByID
* Endpoint: {{host}}/universityPub/byID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    id: [String, university mongo doc ID]
}
```
* Response Body:
```
{
    "_id": [String, mongo doc ID],
    "universityID": [Integer, University ETS Code],
    "domain": [String, universities email domain],
    "moderatorIDs": [
        [Strings, mongo doc IDs of moderator users for this university]
    ],
    "name": [String, university name],
    "description": [String, university description],
    "logo": [IN PROGRESS]
}
```
#### getUniversityByUniversityID
* Endpoint: {{host}}/universityPub/byUniversityID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    universityID: [Integer, university ETS code]
}
```
* Response Body:
```
{
    "_id": [String, mongo doc ID],
    "universityID": [Integer, University ETS Code],
    "domain": [String, universities email domain],
    "moderatorIDs": [
        [Strings, mongo doc IDs of moderator users for this university]
    ],
    "name": [String, university name],
    "description": [String, university description],
    "logo": [IN PROGRESS]
}
```

### Universities (Secure):
#### newUniversity
* Endpoint: {{host}}/universitySec
* Method Type: POST
* Authorization: Header Token, Company Admin
* Request Body:
```
{
    "universityID": [Integer, University ETS Code, GOOGLE "UNIVERSITY ETS CODE" FOR THIS VALUE],
    "domain": [String, universities email domain (i.e. 'abc@rit.edu', domain would be 'rit.edu')],
    "moderatorIDs": [
        [Strings, mongo doc IDs of moderator users for this university]
    ],
    "name": [String, university name],
    "description": [String, university description (Optional)],
    "logo": [IN PROGRESS - OMIT FOR NOW (Optional)]
}
```
* Response Body:
```
{
    "_id": [String, mongo doc ID],
    "universityID": [Integer, University ETS Code],
    "domain": [String, universities email domain],
    "moderatorIDs": [
        [Strings, mongo doc IDs of moderator users for this university]
    ],
    "name": [String, university name],
    "description": [String, university description],
    "logo": [IN PROGRESS]
}
```
#### updateUniversity
* Endpoint: {{host}}/universitySec
* Method Type: PUT
* Authorization: Header Token, Company Admin
* Request Body:
```
{
    "id": [String, mongo doc ID of university to be updated],
    updatedData: {
        <!-- Only include data here that should be updated! Options Include: -->
        "description": [String, Updated university description],
        "name": [String, Updated university name],
        "domain": [String, updated university domain],
        "universityID": [Integer, updated university ETS code],
        "logo": [IN PROGRESS]
    }
}
```
* Response Body:
```
{
    "_id": [String, mongo doc ID],
    "universityID": [Integer, University ETS Code],
    "domain": [String, universities email domain],
    "moderatorIDs": [
        [Strings, mongo doc IDs of moderator users for this university]
    ],
    "name": [String, university name],
    "description": [String, university description],
    "logo": [IN PROGRESS],
    "approvalStatus": [Boolean, whether or not the university has been approved by a moderator]
}
```
#### deleteUniversity
* Endpoint: {{host}}/universitySec
* Method Type: DELETE
* Authorization: Header Token, Company Admin
* Request Body:
```
{
    "id": [String, mongo doc ID]
}
```
* Response Body:
```
{
    "acknowledged": [Boolean, whether or not the delete was successful],
    "deletedCount": [Integer, how many records were deleted]
}
```

### Teams (Public):
#### getAllTeams
* Endpoint: {{host}}/teamPub/all
* Method Type: GET
* Authorization: None
* Request Body:
```
{
    
}
```
* Response Body:
```
{
    "players": [
        [String, array of players mongo doc IDs]
    ],
    "_id": [String, teams mongo doc ID],
    "universityID": [Integer, university id],
    "description": [String, team name],
    "logo": [In Progress],
    "approvalStatus": [Boolean, whether the team has been approved by an admin]
},
{
    Same as above, repeat for as many records as are available
}
```
#### getTeamByID
* Endpoint: {{host}}/teamPub/byID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    "id": [String, teams mongo doc ID]
}
```
* Response Body:
```
{
    "players": [
        [String, array of players mongo doc IDs]
    ],
    "_id": [String, teams mongo doc ID],
    "universityID": [Integer, university id],
    "description": [String, team name],
    "logo": [In Progress],
    "approvalStatus": [Boolean, whether the team has been approved by an admin]
}
```
#### getTeamByUniversityID
* Endpoint: {{host}}/teamPub/byUniID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    "universityID": [Integer, university ID number]
}
```
* Response Body:
```
{
    [
        {
            "players": [
                [String, mongo doc ID of player]
            ],
            "_id": [String, mongo doc ID of team],
            "universityID": [Integer, university ID],
            "description": [String, team descriptions],
            "logo": [Under Development],
            "approvalStatus": [Boolean, whether or not the team has been approved]
        },
        {
            Same as above, repeat for as many records as are available
        }
    ]
}
```

### Teams (Secure):
#### newTeam
* Endpoint: {{host}}/teamSec
* Method Type: POST
* Authorization: Header Token, University or Company Admin
* Request Body:
```
{
    "universityID": [Integer, university id],
    "players": [
        [String, array of user mongo doc IDs for team members]
    ]
}
```
* Response Body:
```
{
    "_id": [String, team mongo doc ID],
    "universityID": [Integer, university id],
    "players": [
        [String, array of user mongo doc IDs for team members]
    ],
    "approvalStatus": [Boolean, whether or not the team has been approved by a moderator],
}
```
#### updateTeam
* Endpoint: {{host}}/teamSec
* Method Type: PUT
* Authorization: Header Token, University or Company Admin
* Request Body:
```
{
    "_id": [String, mongo doc ID of team to be updated],
    updatedData: {
        <!-- Only include data here that should be updated! Options Include: -->
        "players": [String Array, mongo doc IDs of team members],
        "teamID": [Integer, ID of team (deprecated)],
        "universityID": [Integer, university ID that team belongs to],
        "description": [String, team description],
        "logo": [In Progress],
        "approvalStatus": [Boolean, whether or not the team has been approved]
    }
}
```
* Response Body:
```
{
    "result": {
        "acknowledged": [Boolean, whether or not the update passed],
        "modifiedCount": [Integer, Number of Documents Modified],
        "upsertedId": [String, ID of new record if upserted],
        "upsertedCount": [Integer, Number of records upserted],
        "matchedCount": [Integer, How many records matched the original query]
    }
}
```
#### deleteTeam
* Endpoint: {{host}}/teamSec
* Method Type: DELETE
* Authorization: Header Token, Company Admin, University Admin
* Request Body:
```
{
    "_id": [String, teams mongo doc ID]
}
```
* Response Body:
```
{
    "acknowledged": [Boolean, whether or not the DB received your request],
    "deletedCount": [Integer, how many records were deleted]
}
```

### Users (Public):
#### getAllUsers
* Endpoint: {{host}}/userPub/all
* Method Type: GET
* Authorization: None
* Request Body:
```
```
* Response Body:
```
{
    "canMarket": [Boolean, can or cannot send marketing emails to this person],
    "_id": "[String, users mongo doc ID]",
    "roleID": [Integer, users permission integer (See above)],
    "universityID": [Integer, ID of users university],
    "firstName": "[String, users first name]",
    "lastName": "[String, users last name]",
    "email": "[String, users email]"
},
{
    Same as above, repeat as many times as users are returned
}
```
#### getUserByID
* Endpoint: {{host}}/userPub/byID
* Method Type: POST
* Authorization: None
* Request Body:
```
{
    "id": "[String, users mongo doc ID]"
}
```
* Response Body:
```
{
    "canMarket": [Boolean, can or cannot send marketing emails to this person],
    "_id": "[String, users mongo doc ID]",
    "roleID": [Integer, users permission integer (See above)],
    "universityID": [Integer, ID of users university],
    "firstName": "[String, users first name]",
    "lastName": "[String, users last name]",
    "email": "[String, users email]"
}
```

### Users (Secure):
#### updateUserPermission
[[In Progress]]
* Endpoint: {{host}}/userSec/permission
* Method Type: PUT
* Authorization: Header Token, University or Company Admin
* Request Body:
```
```
* Response Body:
```
```
#### getUserProfile
* Endpoint: {{host}}/userSec/permission
* Method Type: POST
* Authorization: Header Token
* Request Body:
```
{

}
```
* Response Body:
```
{
    "canMarket": [Boolean, whether or not to send marketing emails to this person],
    "_id": [String, users mongo doc ID],
    "roleID": [Integer, users role ID],
    "universityID": [Integer, users university ID],
    "firstName": [String, user first name],
    "lastName": [String, user last name],
    "email": [String, user email]
}
```
#### updateMarketingPreferences
* Endpoint: {{host}}/userSec/updateMarketingPreferences
* Method Type: PUT
* Authorization: Header Token
* Request Body:
```
IF Requesting User is an ADMIN:
{
    "id": [String, users mongo doc ID],
    "canMarket": [Boolean, value to update with]
}
IF Requesting User is NOT AN ADMIN:
{
    "canMarket": [Boolean, value to update with]
}
```
* Response Body:
```
{
    "doc": {
        "acknowledged": [Boolean],
        "modifiedCount": [Integer],
        "upsertedId": [String],
        "upsertedCount": [Integer],
        "matchedCount": [Integer]
    }
}
```