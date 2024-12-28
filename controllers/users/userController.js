const User = require("../../models/User/User");
const bcrypt = require("bcryptjs");
const userController = {
  // Register
  register: async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const userFound = await User.findOne({ username, email });
      if (userFound) {
        res.status(400).json({
          status: "error",
          message: "Username or email already exists",
        });
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
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: "Something went wrong",
      });
    }
  },
  //Login

  //Profile
};
