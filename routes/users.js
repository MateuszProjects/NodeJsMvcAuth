var express = require('express');
var router = express.Router();
var connection = require('../db/connection');

/* GET users listing. */
router.get('/', isAuthenticated, (req, res) => {
  res.render('private/index', { username: 'dane', });
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
/*
router.delete('/delete/:id', isAuthenticated, (req, res) => {
  connection.query(sql, req.params.id, (err, done)=>{
      if (err) console.log("error deleate");
  });
  res.redirect('/users/invoice');
});
*/
router.get('/update', isAuthenticated, (req, res)=>{
  res.render('private/update');
});

router.get('/edit/:id', isAuthenticated, (req, res)=>{
  var sql = "SELECT * FROM db_sql where id = ?";
  connection.query(sql, req.params.id, (err, user)=>{
      if (err) console.log("err");
      else res.render('private/update', { data: user[0]});
  });  
   res.redirect('/users/update');
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
