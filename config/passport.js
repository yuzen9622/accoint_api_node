const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const dotenv = require("dotenv");
const UserModel = require("../Model/userModel");
dotenv.config();

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      const user = await UserModel.findOne({ googleId: profile.id });
      if (!user) {
        let newuser = new UserModel({
          googleId: profile.id,
          username: profile.displayName,
          email: profile.emails[0].value,
        });
        await newuser.save();
        return done(null, newuser);
      }

      return done(null, user);
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});
