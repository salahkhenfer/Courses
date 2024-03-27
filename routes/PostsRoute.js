const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  countPosts,
  deletePost,
  updatePostCtrl,
} = require("../controllers/postsController");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyToken,
  verifyTokenAdmin,
  verifyTokenAndAuthoration,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");

router.post("/", verifyToken, photoUpload.single("image"), createPost);
router.get("/", verifyToken, getAllPosts);
router.get("/count", countPosts);
router.get("/:id", validateObjectId, getSinglePost);
router.delete("/:id", validateObjectId, verifyToken, deletePost);
// router.put("/:id", validateObjectId, verifyToken, updatePostCtrl);
router.put("/:id", validateObjectId, verifyToken, updatePostCtrl);

module.exports = router;
