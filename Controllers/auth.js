const asyncMiddleware = require("../middlewares/asyncHandler");
const userModel = require("../Models/user");
const ErrorResponse = require("../utils/ErrorResponse");
const mailSender = require("../utils/MailSender");
const crypto = require("crypto");

//@decs : Register a user
//@route : api/v1/auth/register
//@acess: public
const registerUser = asyncMiddleware(async (req, res, next) => {
  const { name, email, password, role } = req.body;

  const user = await userModel.create({
    name,
    email,
    password,
    role,
  });

  const token = user.getJWT();

  cookieAdderandRes(res, 200, token);
});

//@decs: Login
//@route: /api/v1/auth/login
//@acess:public

const login = asyncMiddleware(async (req, res, next) => {
  const { email, password } = req.body;
  const user = await userModel.findOne({ email }).select("+password");
  if (!user) {
    throw new ErrorResponse("User Not Found", 404);
  }
  const isCorrect = await user.checkPassword(password);

  if (!isCorrect) {
    throw new ErrorResponse("Invalid credentials", 401);
  }

  const token = user.getJWT();

  cookieAdderandRes(res, 200, token);
});

const getme = asyncMiddleware(async (req, res, next) => {
  res.status(200).json({
    sucess: true,
    data: req.user,
  });
});

const logout = asyncMiddleware(async (req, res, next) => {
  const options = {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  };
  res.status(200).cookie("token", null, options).json({
    sucess: true,
    data: null,
  });
});

const resetPasswordEmail = asyncMiddleware(async (req, res, next) => {
  const email = req.body.email;

  const user = await userModel.findOne({ email: email });

  if (!user) {
    throw new ErrorResponse("User Not  Found ", 404);
  }

  const resettoken = await user.getResetToken();

  await user.save({ validateBeforeSave: false });

  const message = `You Have Requested to  Reset a password for ${email} please click below link to reset your passowrd :`;
  const resetURL = `${req.protocol}://${req.get("host")}${
    req.originalUrl
  }/${resettoken}`;

  await mailSender({
    reciver: email,
    subject: "Password Reset",
    message: message + resetURL,
  });

  res.status(200).json({
    sucess: true,
    message: "Check Your Email For Password Reset",
  });
});

//@desc: Reset Password
//@route PUT api/v1/auth/reset/:resettoken
//@acess : Public
const resetPassword = asyncMiddleware(async (req, res, next) => {
  const currenttime = Date.now();
  const passwordResetToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  const user = await userModel.findOne({
    passwordResetToken,
    passwordResetExpire: { $gte: currenttime },
  });

  if (!user) {
    throw new ErrorResponse("Token expired or user doesn't  exist", 404);
  }

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpire = undefined;

  await user.save();

  res.status(200).json({ sucess: true, message: "reset sucessfully" });
});

const updateUser = asyncMiddleware(async (req, res, next) => {
  const fieldtoUpdate = {
    name: req.body.name,
    email: req.body.email,
  };
  const updatedUser = await userModel.findByIdAndUpdate(
    req.user._id,
    fieldtoUpdate,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    sucess: true,
    message: "Updated Sucessfully",
    data: updatedUser,
  });
});

const changePassword = asyncMiddleware(async (req, res, next) => {
  const user = await userModel.findById(req.user.id).select("+password");

  const isCorrect = await user.checkPassword(req.body.oldpassword);

  if (!isCorrect) {
    throw new ErrorResponse("Current Password is incorrect", 401);
  }
  user.password = req.body.newpassword;
  await user.save();
  const token = user.getJWT();

  cookieAdderandRes(res, 200, token);
});

cookieAdderandRes = (res, statusCode, token) => {
  const options = {
    expires: new Date(
      Date.now() + process.env.COOKIE_Expires * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    sucess: true,
    message: " Sucessful",
    token,
  });
};

module.exports.logout = logout;
module.exports.changePassword = changePassword;
module.exports.updateUser = updateUser;
module.exports.resetPassword = resetPassword;
module.exports.resetPasswordEmail = resetPasswordEmail;
module.exports.getme = getme;
module.exports.login = login;
module.exports.registerUser = registerUser;
