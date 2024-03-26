const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

/**
 * @desc    get all users profile
 * @route   /api/users/profile
 * @method GET
 * @access  private (admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();
  res.status(200).json(users);
});

/**
 * @desc    get user profile
 * @route   /api/users/profile/:id
 * @method GET
 * @access  public
 */

module.exports.getUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});
