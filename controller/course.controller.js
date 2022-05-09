const db = require("../db/db.config");
const _ = require("lodash");

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
    db.query(
      `SELECT enrolid FROM mdl_user_enrolments WHERE userid=${req.params.id}`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: "No course found" });
        } else {
          let data = _.map(results, (item) => item.enrolid);
          db.query(
            `SELECT courseid FROM mdl_enrol WHERE id IN (${_.toString(data)})`,
            (error, results, fields) => {
              if (!!error) {
                return res
                  .status(400)
                  .json({ success: false, message: "Empty courses" });
              } else {
                let courses = _.map(results, (item) => item.courseid);
                db.query(
                  `SELECT * FROM mdl_course WHERE id IN (${_.toString(
                    courses
                  )})`,
                  (error, results, fields) => {
                    if (!!error) {
                      return res
                        .status(500)
                        .json({
                          success: false,
                          message: "Internal Server Error",
                        });
                    } else {
                      return res
                        .status(200)
                        .json({ success: true, data: results });
                    }
                  }
                );
              }
            }
          );
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

const enrollUser = async (req, res) => {
  db.query(
    `SELECT id FROM mdl_enrol WHERE sortorder=0 AND courseid=${req.body.courseid}`,
    (error, results, fields) => {
      if (!!error) {
        return res
          .status(500)
          .json({ success: false, message: "Course not found" });
      } else {
        db.query(
          `INSERT INTO mdl_user_enrolments (enrolid,userid) VALUES (${results[0].id},${req.body.userid})`,
          (error, results, fields) => {
            if (!!error) {
              return res.status(500).json({
                success: false,
                message: "Enrol fail because of no need requirements",
              });
            } else {
              return res
                .status(200)
                .json({ success: true, message: "Enrolment successfully!" });
            }
          }
        );
      }
    }
  );
};

const getUserEnrolment = (req, res) => {};

module.exports = {
  getCourses,
  getCoursesCategories,
  getEnrollment,
  getCourseById,
  enrollUser,
};
