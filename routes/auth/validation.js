// Validate that user input (or other arguments) passed in meet our criteria
// Made with the intention of validating form input, request bodies, etc.

// Validates password; follows the following rules:
//      1. >= 8 characters
//      2. alphanumeric
//      3. require special characters (at least 1) -- 
//          3a. allowed -> ~$`!@#%^&*()_-+={[}]|\:;"'<,>.?/
//          3b. not allowed -> any whitespace
function validatePassword(password) {
    if (typeof password !== 'string') return false;
    if (password.length >= 8 && password.match(/^[a-zA-Z0-9~$`!@#%^&*()_\-+={[\]}\|\\:;"'<,>.?/]*$/)) {
        return !!(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/\d/) && password.match(/[~$`!@#%^&*()_\-+={[\]}\|\\:;"'<,>.?/]/));
    } else {
        return false;
    }
}

// Validates emails; follows the following rules:
//      1. begins with 1 or more characters [a-zA-Z0-9_.-]
//      2. followed by an 'at' symbol (@)
//      3. followed by 1 or more characters [a-zA-Z0-9.-] (underscores can't be used in domains)
//      4. followed by a period (.)
//      5. followed by 2 or more characters [a-zA-Z]
function validateEmail(email) {
    if (typeof email !== 'string') return false;
    return !!(email.match(/^(?:[a-zA-Z\d][a-zA-Z\d_-]{5,10}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/));
}

// Validates universityIDs; ensuring input is a number greater than 0
function validateUniversityID(universityID) {
    if (typeof universityID !== 'number') return false;
    return universityID > 0;
}

// Validates universityIDs; ensuring input is a number greater than 0
function validateGameID(gameID) {
    if (typeof gameID !== 'number') return false;
    return gameID > 0;
}

// Validates teamIDs; ensuring input is a string, is not empty, and contains only [a-z0-9] (w/o spaces)
function validateTeamID(teamID) {
    if (typeof teamID !== 'string') return false;
    if (teamID.length < 1) return false;
    return !!(teamID.match(/^[a-z0-9]+$/));
}

// Validates teamIDs; ensuring input is a string, is not empty, and contains only [a-z0-9] (w/o spaces)
function validateUserID(userID) {
    if (typeof userID !== 'string') return false;
    if (userID.length < 1) return false;
    return !!(userID.match(/^[a-z0-9]+$/));
}

// Validates isMarketable; ensuring it is a boolean
function validateMarketable(isMarketable) {
    return (typeof isMarketable === 'boolean');
}

// Validates university, team and people names; follows the following rules:
//      1. must be a string
//      2. must have a length greater than or equal to 1
//      3. must not begin or end with a whitespace character
//      4. name must only contain [a-zA-Z0-9,.'\-\s] (one or more times)
function validateName(name) {
    if (typeof name !== 'string') { return false; }
    if (name.length < 1 || name.match(/^\s|^\w+\s$|\s$/)) return false;
    return !!(name.match(/[a-zA-Z0-9,.'\-\s]+/));
}

module.exports = { 
    validateEmail, 
    validatePassword, 
    validateUniversityID, 
    validateTeamID, 
    validateUserID, 
    validateMarketable, 
    validateName, 
    validateGameID 
};