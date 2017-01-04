'use strict';
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

global.appRoot = path.resolve(__dirname);

var _ = require('underscore');
var routes = require('./routes/index');
var users = require('./routes/users');
var collections = require('./routes/collections');
var MyEmitter = require('./lib/events');
var app = express();


app.myEmitter = new MyEmitter();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/', express.static(path.join(__dirname, 'bower_components')));
app.use('/', routes);
app.use('/users', users);
app.use('/collection', collections);

var ModelsFn = require('./lib/generator');
var Apis = require('./lib/api_generator');
new ModelsFn().then(function(models) {
  // TODO: add rest apis from here
  global.models = models;
  var apis = new Apis(models);
  var keys = _.keys(models);
  keys.forEach(function(key) {
    app.use('/' + key, apis[key]);
  });
  // catch 404 and forward to error handler
  app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
  });

  // error handlers

  // development error handler
  // will print stacktrace
  if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.render('error', {
        message: err.message,
        error: err
      });
    });
  }

  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: {}
    });
  });
  app.myEmitter.emit('initialized');
});



module.exports = app;
