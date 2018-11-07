const express = require('express');
const path = require('path');
const http = require('http');
const createError = require('http-errors');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const logger = require('./helpers/logger');
const mongoose = require('mongoose');
const config = require('./helpers/config');
const cors = require('cors');
const fs = require('fs');
const rfs = require('rotating-file-stream');
var userAPI = require('./routes/users-api')

// Log File Writer
let logDirectory = path.join(__dirname, '../log');
fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);

let accessLogStream = rfs('access.log', {
  interval: '1d',
  path: logDirectory
})


/**
 * MongoDB setup
 */
mongoose.connect('mongodb://' + config.database.username + ':'
  + config.database.password + '@'
  + config.database.url + ':'
  + config.database.port + '/'
  + config.database.name, {promiseLibrary: require('bluebird'), useNewUrlParser: true})
  .then(() => console.debug('Connection to the MongoDB instance was successful'))
  .catch((err) => console.debug('MongoDB Error: ' + err.message))

/**
 * Express
 */
let app = express();

/**
 * App: Setup
 */
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ 'extended': 'true'}));
//app.use(cors());
app.use(express.static(path.join(__dirname, '../dist/WEB-450-BCRS')));
app.use('/', express.static(path.join(__dirname, '../dist/WEB-450-BCRS')));
app.use(morgan('combined', {stream: accessLogStream}));


app.use('/api/user', userAPI)


/**
 * Request handler
 */
app.use(function (req, res, next) {
  next(createError(404));
});

app.use(function (err, req, res, next) {
  logger.debug(err.message);

  res.status(err.status || 500);
  logger.debug(err.status);

  res.sendStatus(err.status);
});

http.createServer(app).listen(3000, function() {
  console.log('Application started and listening on port 3000');
});


