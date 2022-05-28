const express = require("express");
const router = express.Router();
const {
  editUser,
  userInfo,
  listStudents,
  listTeachers,
} = require("../controller/user.controller");

router.post("/:id", editUser);
router.get("/me", userInfo);
router.get("/students", listStudents);
router.get("/teachers", listTeachers);

module.exports = router;
