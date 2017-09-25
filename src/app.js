var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var index = require('./routes/index');
var users = require('./routes/users');

var app = express();
var proxy = require('http-proxy-middleware');

var env = {
    dev: {
        enabled: false,
        urlPrefix: 'http://statictest.tf56.com'
    },
    test: {
        enabled: true,
        urlPrefix: 'http://statictest.tf56.com'
            // urlPrefix: ''
    },
    prod: {
        enabled: false,
        urlPrefix: 'http://data.tf56.com'
            // urlPrefix: ''
    },
    getUrlPrefix: function() {
        if (this.dev.enabled) {
            return this.dev.urlPrefix;
        } else if (this.test.enabled) {
            return this.test.urlPrefix;
        } else if (this.prod.enabled) {
            return this.prod.urlPrefix;
        }
    }
};

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', index);
app.use('/users', users);


app.use('/*', proxy({
    target: env.getUrlPrefix(), //'http://statictest.tf56.com',
    changeOrigin: true,
    headers: {
        "Cookie": "ssoToken=a46beb83dd0f3820a735bbd2cacd9315"
    }
}));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;