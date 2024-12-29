const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User/User");
const bcrypt = require("bcryptjs");

passport.use(
  new localStrategy(
    {
      usernameField: "username", //usernameor email
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid Login" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);
//GOOGLE Oauth
//JWT Options
const Options = {
  jwtFromRequest: ExtractJWT.fromExtractors([
    (req) => {
      let token = null;
      if (req && req.cookies) {
        token = req.cookies["token"];
        return token;
      }
    },
  ]),
  secretOrKey: process.env.JWT_SECRET,
};
passport.use(
  new JWTStrategy(Options, async (userDecoded, done) => {
    try {
      const user = await User.findById(userDecoded._id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err);
    }
  })
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/users/auth/google/callback",
    },
    async (acessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });
        const {
          id,
          displayName,
          name,
          _json: { picture },
        } = profile;

        let email = "";
        if (Array.isArray(profile?.emails) && profile?.emails.length > 0) {
          email = profile.emails[0].value;
        }
        if (!user) {
          user = await User.create({
            username: displayName,
            googleId: id,
            profilePicture: picture,
            authMethod: "google",
            email,
          });
        }
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);
module.exports = passport;
