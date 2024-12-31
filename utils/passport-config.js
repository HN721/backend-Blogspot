const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJWT = require("passport-jwt").ExtractJwt;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User/User");
const bcrypt = require("bcryptjs");

passport.use(
  new LocalStrategy(
    {
      usernameField: "username", //username/email
    },
    async (username, password, done) => {
      try {
        const user = await User.findOne({ username });
        if (!user) {
          return done(null, false, { message: "Invalid login details" });
        }
        //verify the password
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Invalid login details" });
        }
      } catch (error) {
        return done(error);
      }
    }
  )
);

//JWT-Options
const options = {
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
//JWT
passport.use(
  new JWTStrategy(options, async (userDecoded, done) => {
    try {
      const user = await User.findById(userDecoded.id);
      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (error) {
      return done(error, false);
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
