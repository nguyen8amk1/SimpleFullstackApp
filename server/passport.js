const passport  = require('passport');
const GoogleStrategy = require('passport-google-oauth2').Strategy;

passport.use(
    new GoogleStrategy({
        clientID: "39117228837-iktth2scgqkeojkeg5tbemcu2o9ab9fq.apps.googleusercontent.com", 
        clientSecret: "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", 
        callbackURL: "http://localhost:8000/auth/google/callback", 
    },
    (accessToken, refreshToken, profile, done) => {
        // TODO: Your database logic here
        return done(null, profile);
    }
    )
);

passport.serializeUser((user, done) => {

});

passport.deserializeUser((user, done) => {

});