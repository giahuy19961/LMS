const express = require("express");
const router = express.Router();
const {
  getCourses,
  getCoursesCategories,
  getEnrollment,
  getCourseById,
  enrollUser,
} = require("../controller/course.controller");

router.get("/", getCourses);
router.get("/:id", getCourseById);
router.get("/category", getCoursesCategories);
router.get("/enrol/:id", getEnrollment);
router.post("/enrol", enrollUser);

module.exports = router;
