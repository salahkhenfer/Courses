const router = require("express").Router();
const { isValidObjectId } = require("mongoose");
const {
  createPost,
  getAllPosts,
  getSinglePost,
  countPosts,
  deletePost,
  updatePostCtrl,
  updatePostImage,
} = require("../controllers/postsController");
const photoUpload = require("../middlewares/photoUpload");
const {
  verifyToken,
  verifyTokenAdmin,
  verifyTokenAndAuthoration,
} = require("../middlewares/verifyToken");
const validateObjectId = require("../middlewares/validateObjectId");
const { toggleLike } = require("../controllers/usersController");

router.post("/", verifyToken, photoUpload.single("image"), createPost);
router.get("/", verifyToken, getAllPosts);

router.put("/like/:id", validateObjectId, verifyToken, toggleLike);
router.put(
  "/update-image/:id",
  validateObjectId,
  verifyToken,
  photoUpload.single("image"),
  updatePostImage
);
router.get("/:id", validateObjectId, getSinglePost);
router.delete("/:id", validateObjectId, verifyToken, deletePost);
// router.put("/:id", validateObjectId, verifyToken, updatePostCtrl);
router.put("/:id", validateObjectId, verifyToken, updatePostCtrl);
router.get("/count", countPosts);
module.exports = router;
