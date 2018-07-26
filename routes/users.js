const express = require('express');
const router = express.Router();
const connection = require('../db/connection');

var _name = "";
var _surname = "";

/* GET users listing. */
router.get('/', isAuthenticated, (req, res) => {
  console.log("req.session: " + req.session.user.id);
  connection.query("SELECT name, surname FROM db_sql where id  =  ?", [req.session.user.id], (err, rows)=>{
   try  {
    if(err) {
       console.log('err');
    }
    else{
      _name = rows[0].name;
      _surname = rows[0].surname;

      res.render('private/index', {name: _name, surname: _surname});
    } 
  } catch(e){
    console.log('error')
  }
  });
});

router.get('/invoice', isAuthenticated, (req, res) => {
  var sql = "SELECT * FROM db_sql ";
  connection.query(sql, function(err, rows){
      res.render('private/invoice', { username: 'dane', data: rows});
  });
});

router.get('/profile', isAuthenticated,  (req, res) =>{
  res.render('private/profile', { username: 'dane', });
});

router.get('/delete/:id', isAuthenticated, (req, res) => {
  connection.query(sql, req.params.id, (err, done)=>{
      if (err) console.log("error deleate");
  });
  res.redirect('/users/invoice');
});

router.get('/update', isAuthenticated, (req, res)=>{
  res.render('private/update');
});

router.put('/edit/:id', isAuthenticated, (req, res) => {
    var sql = "UPDATE db_sql SET ? WHERE id = " + req.params.id;
    var hash;

    if (req.body.password){
      var salt = '7fa73b47df808d36c5fe328546ddef8b9011b2c6';
      salt = salt+''+req.body.password;
      hash = crypto.createHash('sha1')
                    .update(salt)
                    .digest('hex');          
    }

    var updateObject = {
      name: req.body.name,
      surname: req.body.surname,
      username: req.body.username,
      full_name: req.body.full_name,
      password: hash
    }
    connection.query(sql, updateObject, (err, done)=>{
      if (err) console.log('Error');
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
