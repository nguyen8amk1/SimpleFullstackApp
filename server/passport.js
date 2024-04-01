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
        //console.log("strategy: ", accessToken, refreshToken, profile)
        console.log("strategy");
        console.log("access token: ", accessToken);
        console.log("refresh token: ", refreshToken);

        // TODO: store the access token in to the database ??
            
        //console.log("profile: ", profile);
        return done(null, profile);
    }
    )
);

passport.serializeUser((user, done) => {
    //console.log("serialize: ", user);
    console.log("serialize: ");
    done(null, user);
});

passport.deserializeUser((userProfile, done) => {
    //console.log("deserialize: ", userProfile);
    console.log("deserialize: ");
    done(null, userProfile);
});
