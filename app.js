const createError = require('http-errors');
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
// const cookeSession = requier('cookie-session');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const hbs = require('hbs');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const authGoogleRouter = require('./routes/auth-routes')
const profileRouter = require('./routes/profile-routes');

const passportSetup = require('./config/passport-setup');

const app = express();

// view engine setup
hbs.registerPartials(__dirname + '/views/partials');
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

const flash = require('connect-flash');

/* Login script */
const passport = require('passport');
const sess = require('express-session');
const Store = require('express-session').Store
const BetterMemoryStore = require(__dirname + '/memory')
const store = new BetterMemoryStore({ expires: 60 * 60 * 1000, debug: true })

app.use(sess({
  name: 'JSESSION',
  secret: 'MYSECRETISVERYSECRET',
  store: store,
  resave: true,
  saveUninitialized: true
}));
/*
app.use(cookeSession({

}));
*/
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/auth', authGoogleRouter);
app.use('/profile', profileRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
