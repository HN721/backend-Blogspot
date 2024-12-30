const express = require("express");
const userController = require("../../controllers/users/userController");

const router = express.Router();

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/auth/google", userController.googleAuth);
router.get("/auth/google/callback", userController.googleAuthCallback);
router.get("/checkAuthenticated", userController.checkAuthenticated);
router.post("/logout", userController.logout);

module.exports = router;
