const express = require("express");
const { route } = require("express/lib/application");
const router = express.Router();
const {
  editUser,
  userInfo,
  listStudents,
  listTeachers,
  unlockUser,
} = require("../controller/user.controller");

router.post("/:id", editUser);
router.get("/me", userInfo);
router.get("/students", listStudents);
router.get("/teachers", listTeachers);
router.put("/unlock", unlockUser);

module.exports = router;
