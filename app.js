const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
var cors = require('cors');
const logger = require('morgan');
const history = require('connect-history-api-fallback');
const validator = require('./routes/middleware');


// require dotenv which allows setting variables in .env file
require('dotenv').config();

// require routers
const indexRouter = require('./routes/index');
const userRouter = require('./routes/user');
const freetRouter = require('./routes/freet');

// initalize an express app
const app = express();

// allow express to reroute umatched urls to Vue frontend
app.use(history());

// allow cross origin with POSTMAN
app.use(cors());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// declare the root directory depending on the current env
const isProduction = process.env.NODE_ENV === 'production';
app.use(express.static(path.join(__dirname, isProduction ? 'dist' : 'public')));

// initialize cookie session
app.use(session({ 
  secret: '6170', 
  resave: true, 
  saveUninitialized: false
}));


// this makes sure that if a user is logged in, they still exist in the database
app.use(validator.isCurrentSessionUserExists);

// add routers middleware
app.use('/', indexRouter);
app.use('/api/user', userRouter);
app.use('/api/freets', freetRouter);


// catch all the other routes and display error message
app.all('*', (req, res) => {
  res.status(404).json({
    message: "Page not found"
  }).end();
});

module.exports = app;
