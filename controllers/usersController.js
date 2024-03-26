const asyncHandler = require("express-async-handler");
const { User, validatUpdateUserProfile } = require("../models/User");
const bcrybt = require("bcrypt");
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

/**
 * @desc    Update  user profile
 * @route   /api/users/profile/:id
 * @method PUT
 * @access  private (user him self)
 */

module.exports.updateUserProfile = asyncHandler(async (req, res) => {
  const { error } = validatUpdateUserProfile(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  if (req.body.password) {
    const salt = await bcrybt.genSalt(10);
    req.body.password = await bcrybt.hash(req.body.password, salt);
  }

  const user = await User.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).select("-password");
  if (!user) return res.status(404).json({ message: "User not found" });
  res.status(200).json(user);
});

/**
 * @desc    count   user
 * @route   /api/users/count
 * @method GET
 * @access  private (admin)
 */
module.exports.countUsers = asyncHandler(async (req, res) => {
  const count = await User.countDocuments();
  res.status(200).json(count);
});
