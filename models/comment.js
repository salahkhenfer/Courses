const mongoose = require("mongoose");
const Joi = require("joi");

const commentSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      required: true,
      minlength: 1,
      maxlength: 255,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Post",
    },
    username: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);
const Comment = mongoose.model("Comment", commentSchema);

const validateComment = (comment) => {
  const schema = Joi.object({
    postId: Joi.string().required(),
    text: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(comment);
};

const validateUpdateComment = (comment) => {
  const schema = Joi.object({
    text: Joi.string().min(1).max(255).required(),
  });
  return schema.validate(comment);
};

module.exports = {
  Comment,
  validateComment,
  validateUpdateComment,
};
