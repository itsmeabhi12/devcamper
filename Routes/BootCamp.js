const express = require("express");
const {
  getBootCamps,
  getBootCamp,
  createBootCamp,
  updateBootCamp,
  deleteBootCamp,
  getBootcampsByRadius,
  uploadPhoto,
} = require("../Controllers/BootCamp");

const advanceResult = require("../middlewares/advancedResults");
const { protectRoute, authorized } = require("../middlewares/auth");

const bootcampModel = require("../Models/Bootcamp");
const courseModel = require("../Models/Courses");

// const{getCourses} = require('../Controllers/Courses'); import for alternativr Way for Re-ROuting

//include resource router
const courseRoute = require("./Courses");
const reviewRoute = require("./Review");

const router = express.Router();

//Re-ROuting :  any requrest on  /api/v1/bootcamps/bootcampId/Courses  will be handle  by  this route
router.use("/:bootcampId/courses", courseRoute);
router.use("/:bootcampId/review", reviewRoute);

router.put(
  "/:id/photo",
  protectRoute,
  authorized(["admin", "publisher"]),
  uploadPhoto
);
router.get(
  "/",
  advanceResult(bootcampModel, {
    path: "courses",
    model: courseModel,
  }),
  getBootCamps
);
router.get("/:id", getBootCamp);
router.get("/radius/:zipcode/:distance", getBootcampsByRadius);
router.post(
  "/",
  protectRoute,
  authorized(["admin", "publisher"]),
  createBootCamp
);
router.put(
  "/:id",
  protectRoute,
  authorized(["admin", "publisher"]),
  updateBootCamp
);
router.delete(
  "/:id",
  protectRoute,
  authorized(["admin", "publisher"]),
  deleteBootCamp
);
// router.get('/:bootcampId/courses',getCourses); an  alternative way to Re-ROuting
module.exports = router;
