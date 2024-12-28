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
  //Profile
};

module.exports = userController;
