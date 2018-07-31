const passport = require('passport');
const express = require('express');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const keys = require('../config/keys');
const connection = require('../db/connection');
const crypto = require('crypto');

passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    connection.query("select * from db_sql where id = "+ id, function (err, rows){  
        done(err, rows[0]);
    });
  });

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

            if (user){
                return done(req.flash('message', "User alredy exist."));
            }else{
                var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
                salt = salt+''+profile.name.familyName;
          
                const hash = crypto.createHash('sha1')
                               .update(salt)
                               .digest('hex');   

                var newUser = {
                    name: profile.name.familyName,
                    surname: profile.name.givenName,
                    username: profile.name.familyName,
                    full_name: profile.displayName,
                    password: hash
                }
                connection.query('INSERT INTO db_sql SET ? ',[newUser],(err, done)=>{
                    if (err) console.log('err');
                    else console.log('user add successfully');
                });
            }
        });
    })
);
