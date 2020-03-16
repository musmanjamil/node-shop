const express = require("express");
const router = express();

const {
  register,
  login,
  forgotPassword,
  resetPassword,
  getMe,
  updateDetails,
  updatePassword,
  logout
} = require("../controllers/usersController");
const { protect } = require("../middlewares/auth");

router.route("/user/new").post(register);
router.route("/login").post(login);
router.route("/user/forgotpassword").post(forgotPassword);
router.route("/user/resetpassword/:resettoken").put(resetPassword);
router.route("/user/me").get(protect, getMe);
router.route("/user/updatedetails").put(protect, updateDetails);
router.route("/user/updatepassword").put(protect, updatePassword);
router.route("/logout").get(logout);

module.exports = router;
