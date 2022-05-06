const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCoursesCategories,
  getEnrollment,
  getCourseById,
} = require("../controller/course.controller");

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.get("/category", getCoursesCategories);
router.get("/enrol", getEnrollment);

module.exports = router;
