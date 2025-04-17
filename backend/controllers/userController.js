const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID); 
const crypto = require('crypto');
const nodemailer = require('nodemailer');

exports.googleLogin = async (req, res) => {
    try {
        const { tokenId } = req.body;

        const ticket = await client.verifyIdToken({
            idToken: tokenId,
            audience: process.env.GOOGLE_CLIENT_ID, 
        });

        const payload = ticket.getPayload();
        const googleEmail = payload['email'];
        const googleName = payload['name'];

        
        let user = await User.findOne({ googleId: payload['sub'] });
        if (!user) {
            user = await User.findOne({ email: googleEmail });
            if (!user) {
                
                const newUser = new User({
                    name: googleName,
                    email: googleEmail,
                    googleId: payload['sub'], 
                    password: Math.random().toString(36).substring(7), 
                   
                });
                await newUser.save();
                user = newUser;
            } else {
               
                user.googleId = payload['sub'];
                await user.save();
            }
        }

        
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(200).json({ token });

    } catch (error) {
        console.error("Google login failed:", error);
        res.status(401).json({ error: 'Google login failed' });
    }
};

exports.registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email is already registered. Please log in." });
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const user = new User({ name, email, password: hashedPassword });
    await user.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
  res.json({ token });
};
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
      const user = await User.findOne({ email });
      if (!user) {
          
          return res.status(200).json({ message: "If an account with this email exists, a password reset link has been sent." });
      }

      
      const resetToken = crypto.randomBytes(20).toString('hex');
      console.log("Token before saving in DB:", resetToken);
      user.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      user.resetPasswordExpires = Date.now() + 3600000; // Token expires in 1 hour
      console.log("Hashed token stored in DB:", user.resetPasswordToken);

      await user.save();
      console.log("Token saved successfully for user:", user.email);

     
      const resetLink = `${req.headers.origin}/reset-password/${resetToken}`;
      console.log("Reset Link being sent:", resetLink);


      
      const transporter = nodemailer.createTransport({
         
          service: 'Gmail',
          auth: {
              user: process.env.EMAIL_USER, 
              pass: process.env.EMAIL_PASS 
          }
      });

      const mailOptions = {
          to: user.email,
          subject: 'Password Reset Request',
          html: `
              <p>You are receiving this email because you (or someone else) have requested the reset of a password.</p>
              <p>Please click on the following link, or paste this into your browser to complete the process:</p>
              <a href="${resetLink}">${resetLink}</a>
              <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
          `
      };

      transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
              console.error("Error sending reset email:", error);
              return res.status(500).json({ error: "Failed to send password reset email." });
          }
          console.log('Email sent:', info.response);
          res.status(200).json({ message: "If an account with this email exists, a password reset link has been sent." });
      });

  } catch (error) {
      console.error("Forgot password error:", error);
      res.status(500).json({ error: "Something went wrong." });
  }
};

exports.resetPassword = async (req, res) => {
    const { token } = req.params;         
    const { password } = req.body;
    console.log("Backend received token:", token);

    try {
        
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex'); 
        console.log("Backend generated hashed token:", hashedToken);

        const user = await User.findOne({
            resetPasswordToken: hashedToken,
            resetPasswordExpires: { $gt: Date.now() }
        });

        console.log("Backend found user:", user);
        console.log("Backend current time:", Date.now());
        if (user) {
            console.log("Backend token expires at:", user.resetPasswordExpires);
        }

        if (!user) {
            return res.status(400).json({ error: 'Invalid or expired reset token.' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.resetPasswordToken   = crypto.createHash('sha256').update(resetToken).digest('hex');
        user.resetPasswordExpires = Date.now() + 3600000;
        await user.save();


        res.status(200).json({ message: 'Password reset successfully. You can now log in with your new password.' });

    } catch (error) {
        console.error("Reset password error:", error);
        res.status(500).json({ error: 'Something went wrong during password reset.' });
    }
};
