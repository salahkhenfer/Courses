const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const {
  Post,
  validateCreatePost,
  validateUpdatePost,
} = require("../models/Post");
const asyncHandler = require("express-async-handler");
const {
  uploadImageUploadImage,
  removeImageCloudinary,
} = require("../utils/cloudinary");

/**------------------------------------------
 * @desc    Create a new post
 * @route   /api/posts
 *  @method    POST
 * @access  Private
 *
 * ------------------------------------------*/

module.exports.createPost = asyncHandler(async (req, res) => {
  // validate post
  const { error } = validateCreatePost(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // check if image uploaded
  if (!req.file)
    return res.status(400).json({ message: "Please upload an image" });
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  // upload image
  const result = await uploadImageUploadImage(imagePath);

  // create post
  const post = new Post({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    image: {
      url: result.secure_url,
      publicId: result.public_id,
    },
    user: req.user._id,
  });

  // save post
  await post.save();

  // send response
  res.status(201).json({
    message: "Post created successfully",
    post,
  });

  // delete image from server
  fs.unlinkSync(imagePath);
});

/**------------------------------------------
 * @desc    Get all posts
 *  @route   /api/posts
 * @method GET
 * @access  Public
 * ------------------------------------------*/

module.exports.getAllPosts = asyncHandler(async (req, res) => {
  const POST_PER_PAGE = 2;
  const { pageNumber, category } = req.query;
  let posts;
  if (category) {
    posts = await Post.find({ category })
      .populate("user", "username email")
      .sort({ createdAt: -1 });
  } else if (pageNumber) {
    posts = await Post.find()
      .populate("user", "username email")
      .sort({ createdAt: -1 })
      .skip((pageNumber - 1) * POST_PER_PAGE)
      .limit(POST_PER_PAGE);
  } else {
    posts = await Post.find()
      .populate("user", ["-password", "-createdAt", "-updatedAt", "-__v"])
      .sort({ createdAt: -1 });
  }

  res.status(200).json(posts);
});

/**------------------------------------------
 * @desc    Get single post
 * @route   /api/posts/:id
 * @method GET
 * @access  Public
 * ------------------------------------------*/

module.exports.getSinglePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id)
    .populate("user", ["-password", "-createdAt", "-updatedAt", "-__v"])
    .populate("comments");
  if (!post) return res.status(404).json({ message: "Post not found" });
  res.status(200).json(post);
});

/**------------------------------------------
 * @desc    get count of posts
 * @route   /api/posts/count
 * @method GET
 * @access  Private
 * ------------------------------------------*/

module.exports.countPosts = asyncHandler(async (req, res) => {
  const count = await Post.countDocuments();
  res.status(200).json(count);
});

/**------------------------------------------
 * @desc    delete post
 * @route   /api/posts/:id
 * @method DELETE
 * @access  Private
 * ------------------------------------------*/

module.exports.deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (!post) return res.status(404).json({ message: "Post not found" });

  //   remove cloudanry image
  if (
    post.image.publicId ||
    req.user._id.toString() === post.user.toString() ||
    req.user.isAdmin
  ) {
    await Post.findByIdAndDelete(req.params.id);
    await removeImageCloudinary(post.image.publicId);

    // @TODO: remove comments  of the post
    await Comment.deleteMany({ postId: req.params.id });

    
    return res.status(200).json({ message: "Post deleted successfully" });
  }

  // check if user is the owner of the post

  // delete post

  res
    .status(403)
    .json({ message: "You are not authorized to delete this post" });
});

/**------------------------------------------
 * @desc    update post
 * @route   /api/posts/:id
 * @method  PUT
 * @access  Private (only owner of the post)
 * ------------------------------------------*/
module.exports.updatePostCtrl = asyncHandler(async (req, res) => {
  // 1. Validation
  const { error } = validateUpdatePost(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }

  // 2. Get the post from DB and check if post exist
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  // 3. check if this post belong to logged in user
  if (req.user._id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }

  // 4. Update post
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  ).populate("user", ["-password"]);
  // 5. Send response to the client
  res.status(200).json(updatedPost);
});

/**------------------------------------------
 * @desc    update post image
 * @route   /api/posts/update-image/:id
 * @method  PUT
 * @access  Private
 * ------------------------------------------*/

module.exports.updatePostImage = asyncHandler(async (req, res) => {
  //  Get post from DB
  const post = await Post.findById(req.params.id);
  if (!post) {
    return res.status(404).json({ message: "post not found" });
  }

  //  check if this post belong to logged in user
  if (req.user._id !== post.user.toString()) {
    return res
      .status(403)
      .json({ message: "access denied, you are not allowed" });
  }

  //  check if image uploaded
  if (!req.file) {
    return res.status(400).json({ message: "Please upload an image" });
  }

  //  remove image from cloudinary
  await removeImageCloudinary(post.image.publicId);

  //  upload image
  const imagePath = path.join(__dirname, `../images/${req.file.filename}`);

  const result = await uploadImageUploadImage(imagePath);

  //  update post image
  const updatedPost = await Post.findByIdAndUpdate(
    req.params.id,
    {
      $set: {
        image: {
          url: result.secure_url,
          publicId: result.public_id,
        },
      },
    },
    { new: true }
  ).populate("user", ["-password"]);

  //  send response
  res.status(200).json(updatedPost);
  //  delete image from server
  fs.unlinkSync(imagePath);
});
