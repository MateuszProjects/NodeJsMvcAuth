const router = require('express').Router();

const authCheck = (req, res, next) => {
    if (!res.user){
        res.redirect('');
    } else {
        next();
    }
};

router.get('/', authCheck, (req, resd) =>{
    res.render('pofile', {user: req.user});
});

module.exports = router;