const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

module.exports.verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.headers.authorization.split(" ")[1];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verifyPyload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyPyload;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
});
