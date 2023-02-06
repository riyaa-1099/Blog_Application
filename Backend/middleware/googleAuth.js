const GoogleStrategy = require("passport-google-oauth2").Strategy;
require("dotenv").config();
const passport = require("passport");
const {v4:uuidv4}=require('uuid')
const { Usermodel } = require("../models/user.model");
const jwt=require("jsonwebtoken")

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:7000/auth/google/callback",
      // passReqToCallback   : true
    },
    async function (request, accessToken, profile, cb) {
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return done(err, user);
      // });

       console.log("authpggoogle",profile)
      let email = profile._json.email;
      let name= profile._json.name;
      const current = new Usermodel({
        email,
        password: uuidv4(),
        name
      });
      await current.save();

      let token = jwt.sign({"userID": current._id,"role":current.role}, process.env.secretKey, {
        expiresIn: "1d",
      });
      let refreshToken = jwt.sign({"userID": current._id,"role":current.role}, process.env.refreshKey, {
        expiresIn: "10d",
      });

      console.log("user",current)

      // const {_id,password}=current;

      const payload = {
       current,
        token,
        refreshToken,
        url: profile._json.picture,
      };
      return cb(null, payload);
    }
  )
);
module.exports = passport;
