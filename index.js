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

// Route Imports
const defaultRoute = require('./routes/default.js');
const auth = require('./routes/auth/auth.js');
const loginRoutes = require('./routes/auth/login.js');
const registerRoutes = require('./routes/auth/register.js');
const userRoutes = require('./routes/user/userRoutes.js');
const universityRoutes = require('./routes/university/universityRoutes.js');
const teamRoutes = require('./routes/team/teamRoutes.js');
const permissionRoutes = require('./routes/permissions/permissionRoutes.js');
const gameRoutes = require('./routes/game/gameRoutes.js');

// Route Definitions
app.use('/', defaultRoute);
app.use('/login', loginRoutes);
app.use('/register', registerRoutes);
app.use('/users', auth, userRoutes);
app.use('/universities', auth, universityRoutes);
app.use('/teams', auth, teamRoutes);
app.use('/permissions', permissionRoutes);
app.use('/games', auth, gameRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port} 🙃`);
});