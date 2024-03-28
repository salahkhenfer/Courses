const router = require("express").Router();
const {
  createComment,
  getAllComments,
  deleteComment,
  updateComment,
} = require("../controllers/commentController");
const validateObjectId = require("../middlewares/validateObjectId");
const { verifyToken, verifyTokenAdmin } = require("../middlewares/verifyToken");

router.post("/", verifyToken, createComment);
router.get("/", verifyTokenAdmin, getAllComments);
router.delete("/:id", validateObjectId, verifyTokenAdmin, deleteComment);
router.put("/:id", validateObjectId, verifyToken, updateComment);

module.exports = router;
