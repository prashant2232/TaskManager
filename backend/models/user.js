const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },

  // ← Add these:
  resetPasswordToken:   { type: String },
  resetPasswordExpires: { type: Date   },
});

// Prevent OverwriteModelError
const User = mongoose.models.User || mongoose.model("User", userSchema);
module.exports = User;
