const User = require("../../models/User/User");
const asyncHandler = require("express-async-handler");

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

  //Profile
};

module.exports = userController;
