const router = require("express").Router();
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  countUsers,
  profilePhotoUploadCntr,
  deleteUserProfile,
} = require("../controllers/usersController");
const photoUpload = require("../middlewares/photoUpload");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAdmin,
  verifyToken,
  verifyTokenOnlyuser,
  verifyTokenAndAuthoration,
} = require("../middlewares/verifyToken");

router.get("/profile", verifyTokenAdmin, getAllUsers);
router.get("/profile/:id", verifyToken, validateObjectId, getUserProfile);
router.put(
  "/profile/:id",
  validateObjectId,
  verifyTokenOnlyuser,
  updateUserProfile
);
router.delete(
  "/profile/:id",
  validateObjectId,
  verifyTokenAndAuthoration,
  deleteUserProfile
);
router.post(
  "/profile/profile-photo-upload",
  verifyToken,
  photoUpload.single("profilePhoto"),
  profilePhotoUploadCntr
);

router.get("/count", verifyTokenAdmin, countUsers);

module.exports = router;
