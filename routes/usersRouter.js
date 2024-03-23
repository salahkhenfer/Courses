const router = require("express").Router();
const { getAllUsers } = require("../controllers/usersController");

router.get("/profile", getAllUsers);

module.exports = router;
