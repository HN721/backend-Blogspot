const express = require("express");
const userController = require("../../controllers/users/userController");

const router = express.Router();

router.post("/register", userController.register);

module.exports = router;
