const db = require("../db/db.config");

const getCourses = async (req, res) => {
  try {
    db.query(
      `SELECT * FROM mdl_course ${
        req.query.shortname ? `WHERE shortname="${req.query.shortname}"` : ""
      } `,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: "No course found" });
        } else {
          res.status(200).json({ success: true, data: results });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getCourseById = async (req, res) => {
  try {
    db.query(
      `SELECT * FROM mdl_course WHERE id = ${req.params.id}`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: "No course found" });
        } else {
          res.status(200).json({ success: true, data: results });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getCoursesCategories = async (req, res) => {
  try {
    db.query(
      "SELECT * FROM mdl_course_categories",
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: "No course found" });
        } else {
          res.status(200).json({ success: true, data: results });
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const getEnrollment = async (req, res) => {
  try {
    db.query("SELECT * FROM mdl_event", (error, results, fields) => {
      if (!!error) {
        return res
          .status(400)
          .json({ success: false, message: "No course found" });
      } else {
        res.status(200).json({ success: true, data: results });
      }
    });
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  getCourses,
  getCoursesCategories,
  getEnrollment,
  getCourseById,
};
