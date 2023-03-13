
// Validate that user input (or other arguments) passed in meet our criteria
// Made with the intention of validating form input, request bodies, etc.

// Validates password; follows the following rules:
//      1. >= 8 characters
//      2. alphanumeric
//      3. require special characters (at least 1) -- 
//          3a. allowed -> ~$`!@#%^&*()_-+={[}]|\:;"'<,>.?/
//          3b. not allowed -> any whitespace
function validatePassword(password) {
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
    return !!(email.match(/^(?:[a-zA-Z\d][a-zA-Z\d_-]{5,10}|[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})$/));
}


module.exports = { validateEmail, validatePassword };