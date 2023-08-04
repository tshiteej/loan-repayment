const jwt = require("jsonwebtoken");
// const config = require("config");
const { jwtSecret } = require("../config/index");
const User = require("../models/User");

module.exports = function (req, res, next) {
  // Get token from header
  const token = req.header("x-auth-token");

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  // Verify token
  try {
    jwt.verify(token, jwtSecret, async (error, decoded) => {
      let userData = await User.findOne({ _id: decoded.user.id });
      if (error || !userData) {
        return res.status(401).json({ msg: "Token is not valid" });
      } else {
        req.user = decoded.user;
        next();
      }
    });
  } catch (err) {
    console.error("something wrong with auth middleware");
    res.status(500).json({ msg: "Server Error" });
  }
};
