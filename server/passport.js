const GoogleStrategy = require('passport-google-oauth20').Strategy;
const passport = require('passport')

require('dotenv').config();
console.log(process.env.GOOGLE_CLIENT_ID, process.env.GOOGLE_CLIENT_SECRET);

passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: "api/auth/google/callback"
    },

    // NOTE: this is the 'verify' callback
    // -> must call cb providing a user to complete the authentication
    
    // 2. 
    function(accessToken, refreshToken, profile, cb) {
        // TODO: add user to db 
        // User.findOrCreate({ googleId: profile.id }, function (err, user) {
        //     return cb(err, user);
        // });
        console.log("Profile: ",  profile);
        return cb(null, profile);
    }
));
