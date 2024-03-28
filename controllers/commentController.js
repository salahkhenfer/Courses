const asyncHandler = require("express-async-handler");
const {
  Comment,
  validateComment,
  validateUpdateComment,
} = require("../models/comment");
const { User } = require("../models/User");

/**
 * @desc    Create a new comment
 * @route   /api/comments
 * @method  POST
 * @access  Private
 */
module.exports.createComment = asyncHandler(async (req, res) => {
  // validate comment
  const { error } = validateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const profile = await User.findById(req.user._id).select("-password");
  // create comment
  const comment = new Comment({
    text: req.body.text,
    user: req.user._id,
    postId: req.body.postId,
    username: profile.username,
  });

  // save comment
  await comment.save();

  // send response
  res.status(201).json({
    message: "Comment created successfully",
    comment,
  });
});

/**
 * @desc    Get all comments
 * @route   /api/comments
 * @method  GET
 * @access  Private
 */
module.exports.getAllComments = asyncHandler(async (req, res) => {
  const comments = await Comment.find().populate("user");
  res.status(200).json(comments);
});

/**
 * @desc    delate comment by id
 * @route   /api/comments/:id
 * @method  DELETE
 * @access  Private (owner of comment or admin)
 */
module.exports.deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() === req.user._id || req.user.isAdmin) {
    await Comment.findByIdAndDelete(req.params.id);
    return res.status(200).json({ message: "Comment deleted successfully" });
  } else {
    res
      .status(403)
      .json({ message: "You are not authorized to delete this comment" });
  }
});

/**
 * @desc    Update comment by id
 * @route   /api/comments/:id
 * @method  PUT
 * @access  Private (owner of comment )
 */

module.exports.updateComment = asyncHandler(async (req, res) => {
  // validate comment
  const { error } = validateUpdateComment(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const comment = await Comment.findById(req.params.id);
  if (!comment) return res.status(404).json({ message: "Comment not found" });

  if (comment.user.toString() === req.user._id) {
    const updatedComment = await Comment.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          text: req.body.text,
        },
      },
      { new: true }
    );
    return res.status(200).json({
      message: "Comment updated successfully",
      updatedComment,
    });
  } else {
    res
      .status(403)
      .json({ message: "You are not authorized to update this comment" });
  }
});
