'use strict';

/**
 * Module Dependencies.
 */
var
  express                 = require('express'),
  passport                = require('passport'),
  EncoredEnertalkStrategy = require('../lib').Strategy,
  morgan                  = require('morgan'), // Logger.
  session                 = require('express-session'),
  bodyParser              = require('body-parser'),
  cookieParser            = require('cookie-parser');

/**
 * Configurations.
 */
var
  ENCORED_ENERTALK_CLIENT_ID = 'YOUR_CLIENT_ID',
  ENCORED_ENERTALK_CLIENT_SERCRET = 'YOUR_CLIENT_SECRET';


/**
 * Passport session setup
 */
passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});



/**
 * Use the StackExchangeStrategy within Passport
 */
passport.use(new EncoredEnertalkStrategy({
        clientID: ENCORED_ENERTALK_CLIENT_ID,
        clientSecret: ENCORED_ENERTALK_CLIENT_SERCRET,
        callbackURL: 'http://127.0.0.1:9000/auth/encored-enertalk/callback'
    },
    function (accessToken, refreshToken, profile, done) {
        // asynchronous verification, for effect...
        process.nextTick(function () {

            // To keep the example simple, the user's Enertalk profile is returned to
            // represent the logged-in user.  In a typical application, you would want
            // to associate the account with a Enertalk user record in your database,
            // and return that user instead.
            return done(null, profile);
        });
    }
));



/**
 * Configure Express
 */
var app = express();
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(morgan());
app.use(cookieParser());
app.use(bodyParser());
app.use(session({secret: 'keyboard cat'}));

// Initialize Passport!  Also use passport.session() middleware, to support
// persistent login sessions (recommended).
app.use(passport.initialize());
app.use(passport.session());


app.get('/', function(req, res){
    res.render('index', { user: req.user });
});

app.get('/account', ensureAuthenticated, function(req, res){
    res.render('account', { user: req.user });
});

app.get('/login', function(req, res){
    res.render('login', { user: req.user });
});

app.get('/auth/encored-enertalk',
    passport.authenticate('encored-enertalk'));

app.get('/auth/encored-enertalk/callback',
    passport.authenticate('encored-enertalk', { failureRedirect: '/login' }),
    function(req, res) {
        res.redirect('/');
    });

app.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
});

app.listen(9000);



function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) { return next(); }
    res.redirect('/login');
}