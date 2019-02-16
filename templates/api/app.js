const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const config = require('config')
const mongoose = require('mongoose');
var debug = require('debug')('%&projectname&%:app');

//ROUTERS
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

//DB
mongoose.connect(config.get('db.url'), config.get('db.options'));
var db = mongoose.connection;
db.on('error', function () {
  console.error.bind(console, 'Database connection error')
  process.exit(1);
});
db.once('open', function () {
  debug("Database connection successful");
});

//APP
var app = express();

app.use(logger('dev'));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use(function (err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

module.exports = app;
