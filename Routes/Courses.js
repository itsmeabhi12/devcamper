const express = require("express");
const {
  getCourses,
  addCourse,
  getCourse,
  updateCourse,
  deleteCourse,
} = require("../Controllers/Courses");
const advanceResult = require("../middlewares/advancedResults");
const router = express.Router({ mergeParams: true });
const bootcampModel = require("../Models/Bootcamp");
const courseModel = require("../Models/Courses");
const { protectRoute,authorized } = require("../middlewares/auth");
//mergeParams is set to true  as we  need  bootcampId in req object

router.get(
  "/",
  advanceResult(courseModel, {
    path: "bootcamp",
    model: bootcampModel,
    select: "name description",
  }),
  getCourses
);
router.get("/:id", getCourse);
router.post("/", protectRoute,authorized(['admin','publisher']), addCourse);
router.put("/:id", protectRoute,authorized(['admin','publisher']), updateCourse);
router.delete("/:id", protectRoute,authorized(['admin','publisher']), deleteCourse);

module.exports = router;
