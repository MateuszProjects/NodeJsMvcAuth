const express = require('express');
const router = express.Router();
const passport = require('passport');
const connection = require('..//db/connection');
const LocalStrategy = require('passport-local').Strategy;
const models = require('../models');
const crypto = require('crypto');

const app = express();

app.use(passport.initialize());
app.use(passport.session());

passport.use('local', new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password',
  passReqToCallback: true
  }, function (req, username, password, done) {
      if(!username || !password ) { return done(null, false, req.flash('message','All fields are required.')); }
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      models.user_db.findOne({
              where: {username: username}
        }).then(function(user) {        
          if (user) {
            salt = salt+''+password;
            var encPassword = crypto.createHash('sha1').update(salt).digest('hex');
            var dbPassword = user.password;
      
            if(!(dbPassword == encPassword)){
                return done(null, false, req.flash('message','Invalid username or password.'));
            }
            // add to session user object.
            req.session.user = user;
            return done(null, user);
          } else {
            return done(null, false, req.flash('message', 'Invalid username or password'));
          }
      });
  }
));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  models.user_db.findById(id).then(user => {
    done(null, user);
  });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.render('login', { username: 'dane'});
});

router.get('/register', (req, res)=>{
  res.render('register', {title: "Register page"});
});

router.post('/signin', passport.authenticate('local', {
  successRedirect: '/users',
  failureRedirect: '/',
  failureFlash: true
}), function(req, res, info) {
   res.render('/', {'message': req.flash('message')});
});

router.post('/register', function(req, res, info){
  var username = req.body.username;
  
  moduel.user_db.findOne({
    where: {username: username}
  }).then(function(user){
    if (user){
      return done(req.flash('message', "User alredy exist."));
    } else {
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      salt = salt+''+req.body.password;

      const hash = crypto.createHash('sha1')
                     .update(salt)
                     .digest('hex');              
      var newUser = {
        name: req.body.name,
        surname: req.body.surname,
        username: req.body.username,
        full_name: req.body.full_name,
        password: hash
      }
      models.user_db.create({
        name: req.body.name
        }).then(()=>{

      })
      /*var sql = "INSERT INTO db_sql SET ? ";
      connection.query(sql, newUser, function(err, done){
          if (err) return done(req.flash('message', 'Error.'))
      });
    */
    }
  });
      res.render('register', {'message': req.flash('message')});
});

module.exports = router;
