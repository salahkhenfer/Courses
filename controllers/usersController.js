const asyncHandler = require("express-async-handler");
const { User, validatUpdateUserProfile } = require("../models/User");
const bcrybt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const { uploadImageUploadImage } = require("../utils/cloudinary");
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

/**
 * @desc    Profile photo upload
 * @route   /api/users/profile/profile-photo-upload
 * @method POST
 * @access  private (only User logged in)
 */

module.exports.profilePhotoUploadCntr = asyncHandler(async (req, res) => {
  console.log(req.file);
  // 1  check if file is uploaded
  if (!req.file) return res.status(400).json({ message: "No file uploaded" });
  // get the path of the file
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // upload to cloudinary
  const resulte = await uploadImageUploadImage(imagePath);
  console.log(resulte);
  res.status(200).json({ message: "Profile photo uploaded" });
  // find user and update photo
  const user = await User.findByIdAndUpdate(req.user._id);
  if (user.profilePhoto.public_id !== null) {
    await removeImageCloudinary(user.profilePhoto.public_id);
  }

  // change the profile photo
  user.profilePhoto = {
    url: resulte.secure_url,
    public_id: resulte.public_id,
  };
  await user.save();

  // send response to the client
  res.status(200).json({ message: "Profile photo uploaded" });

  // remove the file from the server
  fs.unlinkSync(imagePath);
});
