const crypto = require("crypto");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, "name is require"]
  },
  email: {
    type: String,
    unique: true,
    match: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      "Please enter valid Email"
    ]
  },
  password: {
    type: String,
    required: [true, "Please enter password"],
    minlength: 8,
    selecte: false
  },
  role: {
    type: String,
    enum: ["seller", "user"],
    default: "user"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  resetPasswordToken: String,
  resetPasswordTokenExpire: Date
});
// bcrypting password
userSchema.pre("save", async function(next) {
  if (!this.isModified("password")) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

//signing jwt and returning
userSchema.methods.getSignedJwtToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};
//match user password with bcrypt password
userSchema.methods.matchPassword = async function(passwordEntered) {
  return await bcrypt.compare(passwordEntered, this.password);
};
//Genrate and Hash Password token
userSchema.methods.getResetPasswordToken = function() {
  // Genrate token

  const resetToken = crypto.randomBytes(20).toString("hex");

  // Hash token and set to reset password token field
  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  //set expire
  this.resetPasswordTokenExpire = Date.now() * 10 * 60 * 1000;

  return resetToken;
};
module.exports = mongoose.model("User", userSchema);
