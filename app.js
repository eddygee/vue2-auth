var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Database
var mongo = require('mongoskin');
var db = mongo.db("mongodb://vividArtssettings:q573JyAvKBgNE7XSXZLq77ccnU@c799.candidate.32.mongolayer.com:10799,c778.candidate.33.mongolayer.com:10778/vividarts?replicaSet=set-551aa868906cc7dd9a0015fc", {native_parser:true});

var routes = require('./routes/index');
var pieces = require('./routes/pieces');
var spots = require('./routes/spots');
var artists = require('./routes/artists');
var pages = require('./routes/pages');
var blog = require('./routes/blog');
var settings = require('./routes/settings');
var accounts = require('./routes/account');
//var loaderio = require('./routes/loaderio');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});
app.use('/', routes);
app.use('/pieces', pieces);
app.use('/spots', spots);
app.use('/artists', artists);
app.use('/pages', pages);
app.use('/blog', blog);
app.use('/auth', accounts);
app.use('/ctrl', settings);
//app.use('/loaderio-1c8e8b375aa7f7ac9c319a7a42f2182e', loaderio);

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


module.exports = app;
