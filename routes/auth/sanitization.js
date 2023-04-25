
// Sanitize user input (or other arguments) passed in to:
//      1. remove unwanted characters
//      2. reformat value
//      3. protect against injections

// Credit: https://www.npmjs.com/package/mongo-sanitize?activeTab=explore
// Removes leading `$ ` from input to prevent `...find({ ... })` injections
function sanitize(v) {
    if (v instanceof Object) {
        for (let key in v) {
            if (/^\$/.test(key)) {
            delete v[key];
            } else {
            sanitize(v[key]);
            }
        }
    }
    return v;
};

module.exports = sanitize;