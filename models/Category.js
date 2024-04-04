const mongoose = require("mongoose");
const Joi = require("joi");

const categorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);
const Category = mongoose.model("Category", categorySchema);

const validateCreateCategory = (category) => {
  const schema = Joi.object({
    title: Joi.string().required(),
  });
  return schema.validate(category);
};

module.exports = {
  Category,
  validateCreateCategory,
};
