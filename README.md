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
