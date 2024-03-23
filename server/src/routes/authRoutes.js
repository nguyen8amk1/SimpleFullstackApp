const router = require('express').Router();
const passport = require('passport');

const authController = require('../controllers/authController')

require('dotenv').config();

// 1.
router.get('/google', passport.authenticate('google', { scope: ['profile'], session: false }));

// 3. 
router.get('/google/callback', 
    // passport.authenticate('google', { failureRedirect: '/' }),
    //
    // (req, res) => {
    //     // Successful authentication, redirect home.
    //     res.redirect('/');
    // }
    
    (req, res, next) => {
        passport.authenticate('google', (err, profile) => {
            req.user = profile;
            next();
        })(req, res, next)
    }, 
    (req, res) => {
        console.log("user : ", req.user);
        // Went back to the client side (react)
        //res.redirect(`${process.env.URL_CLIENT}/login-sucess/${req.user.id}`)
        //res.redirect(`http://localhost:8000/login-success/${req.user.id}`)
    }
);

router.get('/login-success', authController.loginSuccess);

module.exports = router;
