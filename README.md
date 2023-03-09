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

##### Run app
```
nodemon app.js
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
* Request Body:
    ```
    {
        "uid": 123456789, (Integer, Your University ID Number)
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

### Games:
#### getAllGames
* Endpoint: {{host}}/games/all
* Method Type: GET
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
* Endpoint: {{host}}/games/byID
* Method Type: GET
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
#### updateGameInfo
* Endpoint: {{host}}/games
* Method Type: PUT
* Request Body:
```
{
    _id: [String, games mongo doc ID],
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
* Endpoint: {{host}}/games
* Method Type: POST
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
* Endpoint: {{host}}/games
* Method Type: DELETE
* Request Body:
```
{
    _id: [String, games mongo doc ID]
}
```
* Response Body:
```
{
    "acknowledged": [Boolean, whether or not the request was processed],
    "deletedCount": [Integer, how many documents were matched and deleted]
}
```
### Universities:
#### getAllUniversities
* Endpoint: {{host}}/universities/all
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
```
#### getUniversityByID
* Endpoint: {{host}}/universities/byID
* Request Body:
```
```
* Response Body:
```
```

### Teams:
#### getAllTeams
* Endpoint: {{host}}/teams/all
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
```
#### getTeamByID
* Endpoint: {{host}}/teams/byID
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
```

### Users:
#### getAllUsers
* Endpoint: {{host}}/users/all
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
{
    "canMarket": [Boolean, can or cannot send marketing emails to this person],
    "_id": "[String, users mongo doc ID]",
    "uid": [Integer, users university ID number],
    "roleID": [Integer, users permission integer (See above)],
    "universityID": [Integer, ID of users university],
    "teamID": [Integer, ID of users affiliated team],
    "firstName": "[String, users first name]",
    "lastName": "[String, users last name]",
    "email": "[String, users email]"
},
{
    Same as above, repeat as many times as users are returned
}
```
#### getUserByID
* Endpoint: {{host}}/users/byID
* Method Type: GET
* Request Body:
```
{
    "id": "[String, users mongo doc ID]"
}

OR 

{
    "uid": [Integer, users university ID]
}
```
* Response Body:
```
{
    "canMarket": [Boolean, can or cannot send marketing emails to this person],
    "_id": "[String, users mongo doc ID]",
    "uid": [Integer, users university ID number],
    "roleID": [Integer, users permission integer (See above)],
    "universityID": [Integer, ID of users university],
    "teamID": [Integer, ID of users affiliated team],
    "firstName": "[String, users first name]",
    "lastName": "[String, users last name]",
    "email": "[String, users email]"
}
```
#### updateUserPermission
[[In Progress]]
* Endpoint: {{host}}/users/permission
* Method Type: PUT
* Request Body:
```
```
* Response Body:
```
```
#### updateMarketingPreferences
* Endpoint: {{host}}/users/updateMarketingPreferences
* Method Type: PUT
* Request Body:
```
IF Requesting User is an ADMIN:
{
    "uid": [Integer, users university ID],
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