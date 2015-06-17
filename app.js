var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
// Extra: permitirá cargar marcos de aplicación
var partials = require('express-partials');
// Extra: permite usar los métodos PUT y DELETE de HTTP 
var methodOverride = require('method-override');
// Extra: control de sesión habitual en node.js
var session = require('express-session');

var routes = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Hace que se utilice un marco de la aplicación
app.use(partials());

app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded());
app.use(cookieParser('quiz-dalonsod'));
app.use(session());
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos: ayuda con la sesión
app.use(function(req, res, next) {

    // 1º Guardar el path del que se viene, para poder usarlo tras un 
    //    login/logout. Por tanto, es cualquiera menos los dos últimos
    if ( !req.path.match(/\/login|\/logout/) ) {
        // TODO esto no cubre las rutas con parámetros, como la de la 
        //      búsqueda de preguntas
        req.session.redir = req.path;
    }

    // 2º Para las vistas, hacemos visible la información de sesión
    res.locals.session = req.session;

    // Si se necesitan más helpers, se pueden añadir aquí o hacer otro MW
    // ...

    // Continuamos con la ejecución de los MWs
    next();

});

app.use('/', routes);

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
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
