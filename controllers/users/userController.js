const User = require("../../models/User/User");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const userController = {
  // Register
  register: asyncHandler(async (req, res) => {
    const { username, email, password } = req.body;
    const userFound = await User.findOne({ username, email });
    if (userFound) {
      throw new Error("User already exists");
    }

    //Hash the Password
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    //send response
    res.status(201).json({
      status: "success",
      message: "User created successfully",
      user,
    });
  }),
  //Login
  login: asyncHandler(async (req, res, next) => {
    passport.authenticate("local", (err, user, info) => {
      if (err) return next(err);
      if (!user) {
        return res.status(401).json({ message: info.message });
      }
      //generate token
      const token = jwt.sign({ id: user?.i_id }, process.env.JWT_SECRET);
      //set to the cokkie
      res.cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000, // 1day
      });
      res.json({
        status: "success",
        message: "User logged in successfully",
        username: user?.username,
        email: user?.email,
        _id: user?._id,
      });
    })(req, res, next);
  }),
  //Google OAuth
  googleAuth: passport.authenticate("google", { scope: ["profile"] }),
  // Google Callback
  googleAuthCallback: asyncHandler(async (req, res, next) => {
    passport.authenticate(
      "google",
      {
        failureRedirect: "/login",
        session: false,
      },
      (err, user, info) => {
        if (err) return next(err);
        if (!user) {
          return res.redirect("http://localhost:5173/google-login-error");
        }
        //generate token
        const token = jwt.sign({ id: user?._id }, process.env.JWT_SECRET, {
          expiresIn: "1h",
        });
        //set token to cokie
        res.cookie("token", token, {
          httpOnly: true,
          secure: false,
          sameSite: "strict",
          maxAge: 24 * 60 * 60 * 1000, // 1 Day
        });
        //redicrt user to user dahsboard
        res.redirect("http://localhost:5173/dashboard");
      }
    )(req, res, next);
  }),
  checkAuthenticated: asyncHandler(async (req, res) => {
    const token = req.cookies["token"];
    if (!token) {
      res.status(401).json({ isAuthenticated: false });
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      //find user
      const user = await User.findById(decoded.id);
      if (!user) {
        res.status(401).json({ isAuthenticated: false });
      } else {
        return res.status(200).json({
          isAuthenticated: true,
          _id: user?._id,
          username: user?.username,
          profilePicture: user?.profilePicture,
        });
      }
    } catch (err) {
      return res.status(401).json({ isAuthenticated: false, err });
    }
  }),
};

module.exports = userController;
