const router = require("express").Router();
const {
  getAllUsers,
  getUserProfile,
  updateUserProfile,
  countUsers,
} = require("../controllers/usersController");
const validateObjectId = require("../middlewares/validateObjectId");
const {
  verifyTokenAdmin,
  verifyToken,
  verifyTokenOnlyuser,
} = require("../middlewares/verifyToken");

router.get("/profile", verifyTokenAdmin, getAllUsers);
router.get("/profile/:id", verifyToken, validateObjectId, getUserProfile);
router.put(
  "/profile/:id",
  validateObjectId,
  verifyTokenOnlyuser,
  updateUserProfile
);
router.get("/count", verifyTokenAdmin, countUsers);

module.exports = router;
