require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoString = process.env.DATABASE_URL;
let bodyParser = require('body-parser');
const CookieParser = require('cookie-parser');
const port =  process.env.PORT || 5000;

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

// Route Imports
const defaultRoute = require('./routes/default.js');

// Route Definitions
app.use('/', defaultRoute);

app.listen(port, () => {
  console.log(`App listening on port ${port} 🙃`);
});