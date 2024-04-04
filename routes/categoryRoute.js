const router = require("express").Router();
const {
  createCategory,
  getAllCategories,
  removeCategory,
} = require("../controllers/categoryController");

const { verifyTokenAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyTokenAdmin, createCategory);
router.get("/", getAllCategories);
router.delete("/:id", verifyTokenAdmin, removeCategory);

module.exports = router;
