const asyncHandler = require("express-async-handler");
const bcrybt = require("bcrypt");
const { User, validatRegisterUser } = require("../models/User");
/**------------------------------------------
 * @desc    Register a new user
 * @route   /api/auth/register
 * @method POST
 * @access  Public
 ------------------------------------------*/

module.exports.registerModuleCntr = asyncHandler(async (req, res) => {
  // validation
  const { error } = validatRegisterUser(req.body);

  if (error) return res.status(400).send(error.details[0].message);
  // is user exist
  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send("User already registered.");

  // hash password
  const salt = await bcrybt.genSalt(10);
  const hashedPassword = await bcrybt.hash(req.body.password, salt);

  // create user and save it
  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: hashedPassword,
  });
  // send user to save it
  await user.save();

  // send response to the client
  res.status(201).json({
    message: "User Created Successfully",
  });
});
