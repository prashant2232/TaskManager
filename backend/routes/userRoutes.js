const express = require("express");
const { registerUser, loginUser, googleLogin, forgotPassword, resetPassword } = require("../controllers/userController"); // Import forgotPassword

const router = express.Router();

router.get("/ping", (req, res) => res.send("🆙 userRoutes is up!"));

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/forgot-password", forgotPassword); 
router.post("/reset-password/:token", resetPassword);

module.exports = router;