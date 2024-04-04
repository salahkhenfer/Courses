const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

const verifyToken = asyncHandler(async (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Access Denied" });

    const verifyPyload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verifyPyload;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid Token" });
  }
});

// const verifyTokenAdmin = asyncHandler(async (req, res, next) => {
//   verifyToken(req, res, () => {
//     if (!req.user.isAdmin)
//       return res.status(403).json({ message: "Only admin can accses  " });
//     next();
//   });
// });

const verifyTokenAdmin = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (!req.user.isAdmin)
      return res.status(403).json({ message: "Only admin can accses  " });
    next();
  });
});

const verifyTokenOnlyuser = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id !== req.params.id)
      return res.status(403).json({ message: "Only user can accses  " });
    next();
  });
});
const verifyTokenAndAuthoration = asyncHandler(async (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user._id === req.params.id || req.user.isAdmin) {
      next();
    } else {
      return res
        .status(403)
        .json({ message: "Only user or admin can accses  " });
    }
  });
});

module.exports = {
  verifyToken,
  verifyTokenAdmin,
  verifyTokenOnlyuser,
  verifyTokenAndAuthoration,
};
