const asyncHandler = require("express-async-handler");
const { User, validatUpdateUserProfile } = require("../models/User");
const bcrybt = require("bcrypt");
const path = require("path");
const fs = require("fs");
const {
  uploadImageUploadImage,
  removeImageCloudinary,
  cloudinaryRemoveMultipleImage,
} = require("../utils/cloudinary");
const { Post } = require("../models/Post");
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
  const user = await User.findById(req.params.id)
    .select("-password")
    .populate("posts");
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

  // find user and update photo
  const user = await User.findById(req.user._id);
  if (user.profilePhoto.publicId !== null) {
    await removeImageCloudinary(user.profilePhoto.publicId);
  }

  // change the profile photo
  user.profilePhoto = {
    url: resulte.secure_url,
    publicId: resulte.public_id,
  };
  await user.save();

  // send response to the client
  res
    .status(200)
    .json({ message: "Profile photo uploaded", url: resulte.secure_url });

  // remove the file from the server
  fs.unlinkSync(imagePath);
});

/**
 * @desc    delete user
 * @route   /api/users/profile/:id
 * @method DELETE
 * @access  private (admin)
 */
module.exports.deleteUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  // get all user posts
  const post = await Post.find({ user: user._id });
  // get publicId
  const publicId = post?.map((post) => post.image.publicId);

  // remove all images from cloudinary
  if (publicId?.length > 0) {
    await cloudinaryRemoveMultipleImage(publicId);
  }
  if (user.profilePhoto.publicId !== null) {
    await cloudinaryRemoveImage(user.profilePhoto.publicId);
  }

  // delate user posts and comments
  await Post.deleteMany({ user: user._id });
  await Comment.deleteMany({ user: user._id });

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "User deleted" });
});

/**
 * @desc    toggle like
 * @route   /api/users/profile/like/:id
 * @method PUT
 * @access  private (only User logged in)
 */

module.exports.toggleLike = asyncHandler(async (req, res) => {
  const loggedInUser = req.user._id;
  const { id: postId } = req.params;

  let post = await Post.findById(postId);
  if (!post) return res.status(404).json({ message: "Post not found" });

  const isPostAlreadyLiked = post.likes.find(
    (user) => user.toString() === loggedInUser.toString()
  );
  if (isPostAlreadyLiked) {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $pull: { likes: loggedInUser },
      },
      { new: true }
    );
  } else {
    post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { likes: loggedInUser },
      },
      { new: true }
    );
  }

  res.status(200).json(post);
  // send response to the client
});
