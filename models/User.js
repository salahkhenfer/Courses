const { object } = require("joi");
const mongoose = require("mongoose");
const Joi = require("joi");
const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      trim: true,
      minlength: 3,
      maxlength: 50,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 5,
      maxlength: 255,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
      maxlength: 1024,
    },
    profilePhoto: {
      type: Object,
      default: {
        url: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRbyHZ4yjBXpnnG01YecWfbRFKuukNxlmYE4wRGg5I0jaj6StK0BLJ2SaQ-jcUXT_dAlmo&usqp=CAU",
        publicId: null,
      },
    },
    bio: {
      type: String,
      maxlength: 255,
    },
    isAdmin: {
      type: Boolean,
      default: false,
    },
    isAccountVerified: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

function validatRegisterUser(obj) {
  const schema = Joi.object({
    username: Joi.string().min(3).max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(obj);
}
const User = mongoose.model("User", UserSchema);

module.exports = { User, validatRegisterUser };
