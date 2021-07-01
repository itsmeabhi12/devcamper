const express = require("express");
const {
  getReviews,
  getReview,
  createReview,
  updateReview,
  deleteReview,
} = require("../Controllers/Review");
const advanceResult = require("../middlewares/advancedResults");
const reviewModel = require("../Models/Reviews");
const bootcampModel = require("../Models/Bootcamp");
const { protectRoute, authorized } = require("../middlewares/auth");

const router = express.Router({ mergeParams: true });

router.get(
  "/",
  advanceResult(reviewModel, {
    path: "bootcamp",
    model: bootcampModel,
    select: "name description",
  }),
  getReviews
);
router.get("/:id", getReview);
router.post("/", protectRoute, authorized(["user", "admin"]), createReview);
router.put("/:id", protectRoute, authorized(["user", "admin"]), updateReview);
router.delete(
  "/:id",
  protectRoute,
  authorized(["user", "admin"]),
  deleteReview
);

module.exports = router;
