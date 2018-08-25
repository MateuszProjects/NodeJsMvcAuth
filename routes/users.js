const express = require('express');
const router = express.Router();
const models = require('../models');
const data = require('node-datetime');


/* GET users listing. */
router.get('/', isAuthenticated, (req, res) => {
      res.render('private/index', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/invoice', isAuthenticated, (req, res) => {
  models.user_db.findAll().then(function(user){
    res.render('private/invoice', { name: req.session.user.firstname, surname: req.session.user.lastname, data: user});
  });
});

router.get('/boxed', isAuthenticated, (req, res) => {
  res.render('private/boxed', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/fixed', isAuthenticated, (req, res) => {
  res.render('private/fixed', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/pacepage', isAuthenticated, (req, res) => {
  res.render('private/pacepage', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/dashboard1', isAuthenticated, (req, res) => {
  res.render('private/dashboard1', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/dashboard2', isAuthenticated, (req, res) => {
  res.render('private/dashboard2', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/profile', isAuthenticated,  (req, res) =>{
  res.render('private/profile', {name: req.session.user.name, surname: req.session.user.surname});
});

router.get('/delete/:id', isAuthenticated, (req, res) => {
});

router.get('/update', isAuthenticated, (req, res)=>{
  res.render('private/update', {name: req.session.user.name, surname: req.session.user.surname});
});

router.put('/edit/:id', isAuthenticated, (req, res) => {
    var hash;

    if (req.body.password){
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      salt = salt+''+req.body.password;
      hash = crypto.createHash('sha1')
                    .update(salt)
                    .digest('hex');          
    }

    var dt = data.create();
    var formatted = dt.format('Y-m-d H:M:S');

    models.user_db.update({
      firstname: req.body.name,
      lastname: req.body.surname,
      username: req.body.username,
      passport: hash,
      last_login: formatted,
      updateAt: formatted
      }).then(()=>{
        console.log("New user has been update");
    });
});

/* GET users listing. */
router.get('/', function(req, res, next) {
 models.user_db.findAll().then(function(user){
    res.send(user);
   });
});

// logout with app.
router.get('/logout', function(req, res){
  req.session.destroy();
  req.logout();
  res.redirect('/');
  });
  
function isAuthenticated(req, res, next) {
  if (req.session.user)
      return next();

  // IF A USER ISN'T LOGGED IN, THEN REDIRECT THEM SIGNIN PAGE
  res.redirect('login');
}

module.exports = router;
