const jwt = require('jsonwebtoken');
const catchAsyncErrors = require('../utils/catchAsyncErrors');
const ErrorHandler = require('../utils/errorHandler');
const User = require('../models/user');

// Protect routes
exports.protect = catchAsyncErrors(async (req, res, next) => {
    let token;
  
    // if (
    //   req.headers.authorization &&
    //   req.headers.authorization.startsWith('Bearer')
    // ) {
    //   // Set token from Bearer token in header
    //  // token = req.headers.authorization.split(' ')[1];
    //   // Set token from cookie
    // }
    // else 
    if (req.cookies.token) {
      token = req.cookies.token;
    }
  
    // Make sure token exists
    if (!token) {
      return next(new ErrorHandler('Not authorized to access this route', 401));
    }
  
    try {
      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
  
      req.user = await User.findById(decoded.id);
  
      next();
    } catch (err) {
      return next(new ErrorHandler('Not authorized to access this route', 401));
    }
  });