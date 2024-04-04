const asyncHandler = require("express-async-handler");

const { Category, validateCreateCategory } = require("../models/Category");

/**------------------------------------------
 * @desc    Create a new category
 * @route   /api/categories
 * @method    POST
 * @access  Private
 * ------------------------------------------*/

module.exports.createCategory = asyncHandler(async (req, res) => {
  const { error } = validateCreateCategory(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // create category
  const category = new Category({
    title: req.body.title,
    user: req.user._id,
  });

  // save category
  await category.save();

  // send response
  res.status(201).json({
    message: "Category created successfully",
    category,
  });
});

/**------------------------------------------
 * @desc    Get all categories
 *  @route   /api/categories
 * @method  GET
 * @access  Public
 * ------------------------------------------*/

module.exports.getAllCategories = asyncHandler(async (req, res) => {
  fffff;
  const categories = await Category.find();
  res.status(200).json(categories);
});

/**------------------------------------------
 * @desc    remove category by id
 * @route   /api/categories/:id
 * @method  DELETE
 * @access  Private (only admin)
 * ------------------------------------------*/

module.exports.removeCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) return res.status(404).json({ message: "Category not found" });

  await Category.findByIdAndDelete(req.params.id);

  res.status(200).json({ message: "Category removed successfully" });
});
