const router = require("express").Router();
const {
  getAllUsers,
  getUserProfile,
} = require("../controllers/usersController");
const { verifyTokenAdmin, verifyToken } = require("../middlewares/verifyToken");

router.get("/profile", verifyTokenAdmin, getAllUsers);
router.get("/profile/:id", verifyToken, validateObjectId, getUserProfile);

module.exports = router;
