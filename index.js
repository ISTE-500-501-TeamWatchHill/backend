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
    console.error(error)
})

db.once('connected', () => {
    console.info('Database Connected');
})

app.use(cors({origin: '*'}));

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
const adminSecure = require('./routes/admin/adminSecure.js');
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
app.use('/api/', defaultRoute);
app.use('/api/login', loginRoutes);
app.use('/api/register', registerRoutes);

// Secure Route Definitions
app.use('/api/admin', auth, adminSecure);
app.use('/api/userSec', auth, userSecure);
app.use('/api/universitySec', auth, universitySecure);
app.use('/api/teamSec', auth, teamSecure);
app.use('/api/gameSec', auth, gameSecure);

// Public Route Definitions
app.use('/api/userPub', userPublic);
app.use('/api/universityPub', universityPublic);
app.use('/api/teamPub', teamPublic);
app.use('/api/gamePub', gamePublic);

app.listen(port, () => {
  console.info(`App listening on port ${port} 🙃`);
});