const router = require("express").Router();
const { getAllUsers } = require("../controllers/usersController");
const { verifyToken } = require("../middlewares/verifyToken");

router.get("/profile", verifyToken, getAllUsers);

module.exports = router;
