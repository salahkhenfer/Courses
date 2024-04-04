const asyncHandler = require("express-async-handler");
const bcrybt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  User,
  validatRegisterUser,
  validatLoginUser,
} = require("../models/User");
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
  if (user) return res.status(400).json({ message: "email  already exist" });

  let username = await User.findOne({ username: req.body.username });
  if (username)
    return res.status(400).json({ message: "username already exist" });
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
  // @TODO: verify user account

  // send response to the client
  res.status(201).json({
    message: "User Created Successfully",
  });
});

/**------------------------------------------
 * @desc    Login  user
 * @route   /api/auth/login
 * @method POST
 * @access  Public
 ------------------------------------------*/
module.exports.loginModuleCntr = asyncHandler(async (req, res) => {
  // validation
  const { error } = validatLoginUser(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  // is user exist
  let user = await User.findOne({ email: req.body.email });
  if (!user)
    return res.status(400).json({ message: "you are not registerd user." });

  // compare password
  const validPassword = await bcrybt.compare(req.body.password, user.password);
  if (!validPassword)
    return res.status(400).json({ message: " password not valid " });
  // @TODO: verify user account

  // generate token jwt
  const token = user.genrateToken();
  // send response to the client
  res.status(200).json({
    _id: user._id,
    isAdmin: user.isAdmin,
    profilePhoto: user.profilePhoto,
    token: token,
    username: user.username,
  });
});
