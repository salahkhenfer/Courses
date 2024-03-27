const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const PostSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 255,
    },
    image: {
      type: Object,
      default: {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyHZ4yjBXpnnG01YecWfbRFKuukNxlmYE4wRGg5I0jaj6StK0BLJ2SaQ-jcUXT_dAlmo&usqp=CAU",
        publicId: null,
      },
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

const validateCreatePost = (post) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255).required(),
    description: Joi.string().min(3).max(255).required(),
    category: Joi.string().required(),
  });

  return schema.validate(post);
};

const validateUpdatePost = (post) => {
  const schema = Joi.object({
    title: Joi.string().min(3).max(255),
    description: Joi.string().min(3).max(255),
    category: Joi.string(),
  });

  return schema.validate(post);
};

PostSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    {
      _id: this._id,
    },
    process.env.JWT_SECRET
  );

  return token;
};

const Post = mongoose.model("Post", PostSchema);

module.exports = { Post, validateCreatePost, validateUpdatePost };
