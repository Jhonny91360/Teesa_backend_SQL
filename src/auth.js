require("dotenv").config();
const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET,URL_BACK} = process.env
const passport = require("passport");
const GoogleStrategy = require('passport-google-oauth20').Strategy;

const googleStrategySignup = new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
               //https://servidor-teesa.onrender.com/
    callbackURL:`${URL_BACK}/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    
      return cb(null, profile)
    
  }
);

const googleStrategyLogin= new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
                //https://servidor-teesa.onrender.com/
    callbackURL: `${URL_BACK}/auth/google/callback`
  },
  function(accessToken, refreshToken, profile, cb) {
    
      return cb(null, profile);
    
  }
);

passport.use("google-signup", googleStrategySignup);
passport.use("google-login", googleStrategyLogin);

passport.serializeUser(function(user,done){
    done(null, user)
})

passport.deserializeUser(function(user,done){
    done(null,user)
})