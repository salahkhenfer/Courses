const router = require("express").Router();
const {
  registerModuleCntr,
  loginModuleCntr,
} = require("../controllers/authController");
// api/auth/register
router.post("/register", registerModuleCntr);
router.post("/login", loginModuleCntr);

module.exports = router;
