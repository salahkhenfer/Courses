const mongoose = require("mongoose");
const asyncHandler = require("express-async-handler");

const validateObjectId = asyncHandler(async (req, res, next) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id))
    return res.status(400).json({ message: "Invalid Object Id" });
  next();
});
