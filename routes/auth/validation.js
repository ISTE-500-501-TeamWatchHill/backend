// Validate that user input (or other arguments) passed in meet our criteria
// Made with the intention of validating form input, request bodies, etc.

// Validates password; follows the following rules:
//      1. >= 8 characters
//      2. alphanumeric
//      3. require special characters (at least 1) -- 
//          3a. allowed -> ~$`!@#%^&*()_-+={[}]|\:;"'<,>.?/
//          3b. not allowed -> any whitespace
function validatePassword(password) {
    if (typeof password !== 'string') { return false; }
    if (password.length >= 8 && password.match(/^[a-zA-Z0-9~$`!@#%^&*()_\-+={[\]}\|\\:;"'<,>.?/]*$/)) {
        return !!(password.match(/[a-z]/) && password.match(/[A-Z]/) && password.match(/[0-9]/) && password.match(/[~$`!@#%^&*()_\-+={[\]}\|\\:;"'<,>.?/]/));
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
    if (typeof email !== 'string') { return false; }
    return !!(email.match(/^(?:[a-zA-Z\d][a-zA-Z\d_-]{5,10}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/));
}

// Validates university, team and people names; follows the following rules:
//      1. must be a string
//      2. must have a length greater than or equal to 1
//      3. must not begin or end with a whitespace character
//      4. name must only contain [a-zA-Z0-9,.'\-\s] (one or more times)
function validateName(name) {
    const trimmed = name.trim();
    if (typeof trimmed !== 'string') { return false; }
    if (trimmed.length < 1 || trimmed.match(/^\s|^\w+\s$|\s$/)) { return false; }
    return !!(trimmed.match(/^[a-zA-Z0-9,.'\-\s]*$/));
}

// Validates number IDs; ensuring input is a number greater than 0
function validateNonNullNumberID(v) {
    if (typeof v !== 'number') { return false; }
    return v > 0;
}

// same as above, but allows for null
function validateNullableNumberID(v) {
    if (v === null) { return true; }
    if (typeof v !== 'number'){ return false; }
    return v > 0;
}

// Validates string hash IDs; ensuring input is a string, is not empty, and contains only [a-z0-9] (w/o spaces)
function validateNonNullStringHashID(v) {
    if (typeof v !== 'string') { return false; }
    if (v.length < 1) { return false; }
    return !!(v.match(/^[a-z0-9]+$/));
}

// same as above, but allows for null
function validateNullableStringHashID(v) {
    if (v === null) { return true; }
    if (typeof v !== 'string') { return false; }
    if (v.length < 1) { return false; }
    return !!(v.match(/^[a-z0-9]+$/));
}

// Validates argument is a boolean
function validateIsBoolean(v) {
    return (typeof v === 'boolean');
}

// Validates input is a valid ISO Date
function validateISODateTime(datetime) {
    if (typeof datetime !== 'string') { return false; }
    if (!(datetime.match(/^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-9]{2}:[0-9]{2}:[0-9]{2}(\.[0-9]{3})?Z$/))) { return false; }
    const test = new Date(datetime);
    return !isNaN(test);
}

function generateRandomString() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}${month}${day}_${hour}${minute}${second}`;

    return formattedDate;
}

module.exports = { 
    validateEmail,
    validatePassword,
    validateNonNullNumberID,
    validateNullableNumberID,
    validateNonNullStringHashID,
    validateNullableStringHashID,
    validateIsBoolean,
    validateName,
    validateISODateTime,
    generateRandomString,
};