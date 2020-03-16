const User = require("../models/user");
const catchAsyncError = require("../utils/catchAsyncErrors");
const ErrorHandler = require("../utils/errorHandler");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");

//Register a new user => api/v1/user/new
exports.register = catchAsyncError(async (req, res, next) => {
  const { name, email, password, role } = req.body;
  //create user
  const user = await User.create({
    name,
    email,
    password,
    role
  });
  sendTokenResponse(user, 200, res);
});

//Login user => api/v1/login
exports.login = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;
  //Validate Email And Password
  if (!email || !password) {
    return next(new ErrorHandler("please Enter email and password"), 400);
  }
  //check user
  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new ErrorHandler("invalid credentials", 401));
  }
  //check if password match
  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return next(new ErrorHandler("invalid credentials", 401));
  }
  sendTokenResponse(user, 200, res);
});

// forgot password route => api/v1/user/forgotpassword
exports.forgotPassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new ErrorHandler("there is no user with that email", 404));
  }
  //get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({ validateBeforeSave: false });
  // Create reset url
  const resetUrl = `${req.protocol}://${req.get(
    "host"
  )}/api/v1/user/resetpassword/${resetToken}`;

  const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

  try {
    await sendEmail({
      email: user.email,
      subject: "Password reset token",
      message
    });

    res.status(200).json({ success: true, data: "Email sent" });
  } catch (err) {
    console.log(err);
    user.resetPasswordToken = undefined;
    user.resetPasswordTokenExpire = undefined;

    await user.save({ validateBeforeSave: false });

    return next(new ErrorHandler("Email could not be sent", 500));
  }
});

// reset password route => api/v1/user/resetpassword/:resettoken
exports.resetPassword = catchAsyncError(async (req, res, next) => {
  // get hashed token
  const resetPasswordToken = crypto
    .createHash("sha256")
    .update(req.params.resettoken)
    .digest("hex");
  
  const user = await User.findOne({
    resetPasswordToken
    //resetPasswordTokenExpire:{ $gt :Date.now()}
  });

  if(!user){
    return next(new ErrorHandler('Invalid token'),400)
  }
  //set new password
  user.password=req.body.password;
  user.resetPasswordToken = undefined;
  user.resetPasswordTokenExpire = undefined;
  await user.save();
  sendTokenResponse(user, 200, res);
});

// to get details about loged in user => Get api/v1/user/me
exports.getMe= catchAsyncError(async(req,res,next)=>{

  const user = await User.findById(req.user.id);

  res.status(200).json({
    success:true,
    data:user
  })
});
//To update data => put api/v1/user/updateDetails
exports.updateDetails = catchAsyncError(async (req, res, next) => {
  const fieldsToUpdate = {
    name: req.body.name,
    email: req.body.email
  };

  const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    data: user
  });
});
// to update password => put api/v1/user/updatepassword
exports.updatePassword = catchAsyncError(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('+password');

  // Check current password
  if (!(await user.matchPassword(req.body.currentPassword))) {
    return next(new ErrorHandler('Password is incorrect', 401));
  }

  user.password = req.body.newPassword;
  await user.save();

  sendTokenResponse(user, 200, res);
});
// To logout user => api/v1/logout
exports.logout = catchAsyncError(async (req, res, next) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });

  res.status(200).json({
    success: true,
    data: {}
  });
});

//get token from model create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  //create token
  const token = user.getSignedJwtToken();
  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({
      success: true,
      token
    });
};
