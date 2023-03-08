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
```
#### getUserByID
* Endpoint: {{host}}/users/byID
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
```
#### updateUserPermission
* Endpoint: {{host}}/users/permission
* Method Type: PUT
* Request Body:
```
```
* Response Body:
```
```
