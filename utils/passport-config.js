const passport = require("passport");
const localStrategy = require("passport-local").Strategy;
const User = require("../models/User/User");
const bcrypt = require("bcrypt");
passport.use(
  new localStrategy(
    {
      usernameField: "username", //usernameor email
    },
    async (email, password, done) => {
      try {
        const user = await User.findOne({ email });
        if (!user) {
          return done(null, false, { message: "User not found" });
        }
        const match = await bcrypt.compare(password, user.password);
        if (match) {
          return done(null, user);
        } else {
          return done(null, false, { message: "Incorrect password" });
        }
      } catch (err) {
        return done(err);
      }
    }
  )
);

module.exports = passport;
