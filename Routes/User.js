const express = require("express");
const {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
} = require("../Controllers/users");
const router = express.Router();
const { protectRoute, authorized } = require("../middlewares/auth");
const advanceResult = require("../middlewares/advancedResults");
const userModel = require("../Models/user");

router.use(protectRoute);
router.use(authorized(["admin"]));

router.post("/", createUser);
router.get("/", advanceResult(userModel), getUsers);
router.get("/:id", getUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

module.exports = router;
