const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('../config/keys');
const connection = require('../db/connection');

passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
       //  passReqToCallback: true
    }, (accessToken, refreshToken, profile, done) => {
        // add new user:
        console.log(profile);
        connection.query('SELECT * FORM db_sql where username = ?', [profile.displayName], (err, user) => {
            if (err) console.log('error add user.');

            if (user){
                return done(req.flash('message', "User alredy exist."));
            }else{
                /*
                var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
                salt = ""; //salt+''+req.body.password;
          
                const hash = crypto.createHash('sha1')
                               .update(salt)
                               .digest('hex');   

                var newUser = {
                    name: profile.clientID,
                    surname: profile.clientID,
                    username: profile.callbackURL,
                    full_name: profile.clientID,
                    password: hash
                }
                connection.query('INSERT INTO db_sql SET ? ',[newUser],(err, done)=>{
                    if (err) console.log('err');
                });*/
            }
        });
    })
);