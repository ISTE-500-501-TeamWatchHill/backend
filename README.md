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
```
* Response Body:
```
```
#### getGameByID
* Endpoint: {{host}}/games/byID
* Method Type: GET
* Request Body:
```
```
* Response Body:
```
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