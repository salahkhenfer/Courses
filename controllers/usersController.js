const asyncHandler = require("express-async-handler");
const { User } = require("../models/User");

/**
 * @desc    get all users profile
 * @route   /api/users/profile
 * @method POST
 * @access  private (admin)
 */
module.exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find();

  res.status(200).json(users);
});
