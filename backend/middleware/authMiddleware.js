const jwt = require("jsonwebtoken");
const User = require("../models/User"); 

module.exports = async (req, res, next) => {
  let token = req.header("Authorization");

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized - No token provided" });
  }

  try {
    
    token = token.split(" ")[1];

    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    
    req.userId = decoded.userId;

    
    req.user = await User.findById(decoded.userId).select("-password");

    next(); 
  } catch (error) {
    console.error("JWT Verification Error:", error);
    res.status(401).json({ error: "Invalid or expired token" });
  }
};
