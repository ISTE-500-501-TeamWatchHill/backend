require('dotenv').config();
const cors = require('cors');

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
let bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const port =  process.env.PORT || 5000;
const mongoSanitize = require('express-mongo-sanitize');

// Middleware
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(CookieParser());

// DB Scripts
mongoose.connect(mongoString);
const db = mongoose.connection;
mongoose.set('strictQuery', false);
db.on('error', (error) => {
    console.log(error)
})

db.once('connected', () => {
    console.log('Database Connected');
})

app.use(cors({origin: '*'}));

// https://www.npmjs.com/package/express-mongo-sanitize?activeTab=readme
app.use(
  mongoSanitize({
    allowDots: true, // typically forbidden, but we want to allow for emails
    replaceWith: '_', // replaces forbidden $ with _
  }),
);

// https://www.npmjs.com/package/express-mongo-sanitize?activeTab=readme
app.use(
  mongoSanitize({
    allowDots: true, // typically forbidden, but we want to allow for emails
    replaceWith: '_', // replaces forbidden $ with _
  }),
);

// Universal Route Imports
const defaultRoute = require('./routes/default.js');
const auth = require('./routes/auth/auth.js');
const loginRoutes = require('./routes/auth/login.js');
const registerRoutes = require('./routes/auth/register.js');

// Secure Route Imports
const userSecure = require('./routes/user/userSecure.js');
const universitySecure = require('./routes/university/universitySecure.js');
const teamSecure = require('./routes/team/teamSecure.js');
const gameSecure = require('./routes/game/gameSecure.js');

// Public Route Imports
const userPublic = require('./routes/user/userPublic.js');
const universityPublic = require('./routes/university/universityPublic.js');
const teamPublic = require('./routes/team/teamPublic.js');
const gamePublic = require('./routes/game/gamePublic.js');


// Universal Route Definitions
app.use('/', defaultRoute);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);

// Secure Route Definitions
app.use('/userSec', auth, userSecure);
app.use('/universitySec', auth, universitySecure);
app.use('/teamSec', auth, teamSecure);
app.use('/gameSec', auth, gameSecure);

// Public Route Definitions
app.use('/userPub', userPublic);
app.use('/universityPub', universityPublic);
app.use('/teamPub', teamPublic);
app.use('/gamePub', gamePublic);

app.listen(port, () => {
  console.log(`App listening on port ${port} 🙃`);
});