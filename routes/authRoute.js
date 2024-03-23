const router = require("express").Router();
const { registerModuleCntr } = require("../controllers/authController");
const { User } = require("../models/User");
// api/auth/register
router.post("/register", registerModuleCntr);

module.exports = router;
