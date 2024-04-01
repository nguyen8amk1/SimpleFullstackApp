const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;
const {CLIENT_ID, CLIENT_SECRET} = require('./keys');

const testdatabase = {};

passport.use(
    new GoogleStrategy({
        clientID: CLIENT_ID, 
        clientSecret: CLIENT_SECRET, 
        callbackURL: '/auth/google/callback', 
    },
    (accessToken, refreshToken, profile, done) => {
        // NOTE: this is the callback that get's called right after the callback route is called 
            
        // TODO: Your database logic here
        //console.log("strategy: ", accessToken, refreshToken, profile)
            
        // console.log("strategy");
        // console.log("access token: ", accessToken);
        // console.log("refresh token: ", refreshToken);
        //console.log(profile);

        // TODO: store the access token into the database
            
        //console.log("profile: ", profile);
        testdatabase[profile.id] = {
            userInfo: "ditmemay",
            accessToken: accessToken, 
            refreshToken: refreshToken
        };
        return done(null, profile.id);
    })
);

passport.serializeUser((userId, done) => {
    //console.log("serialize: ", user);
    // NOTE: this is called right after the callback, the user is the thing that get passed from the called
    // TODO: put the session/user id into the cookie
    console.log("serialize: ", userId);
    done(null, userId);
});

passport.deserializeUser((userId, done) => {
    //console.log("deserialize: ", userProfile);
    // TODO: get the user info from the user id get from the cookie  
    console.log("deserialize: ", userId);
    const user = testdatabase[userId];

    // TODO: do something when fail 
    console.log(user);
    done(null, user);
});
