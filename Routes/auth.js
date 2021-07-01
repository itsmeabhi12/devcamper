const express = require("express");

const router = express.Router();

const {
  registerUser,
  login,
  getme,
  resetPasswordEmail,
  resetPassword,
  updateUser,
  logout,
  changePassword,
} = require("../Controllers/auth");
const { protectRoute } = require("../middlewares/auth");

router.post("/register", registerUser);
router.post("/login", login);
router.get("/me", protectRoute, getme);
router.get("/logout", protectRoute, logout);
router.post("/resetpassword", resetPasswordEmail);
router.put("/resetpassword/:resettoken", resetPassword);
router.put("/user/edit", protectRoute, updateUser);
router.put("/user/changePassword", protectRoute, changePassword);

module.exports = router;
