const db = require("../db/db.config");
const _ = require("lodash");
const jwt_decode = require("jwt-decode");
const { INTERNAL_ERROR } = require("../constants/error");
const sendMail = require("../helper/sendMail");

const editUser = async (req, res) => {
  const { body } = req;
  if (!body) {
    return res.status(400).json({
      success: false,
      message: "Thông tin cập nhật user không được bỏ trống",
    });
  }
  let valuesInsert = ``;

  _.mapKeys(body, (value, key) => {
    if (_.isEmpty(valuesInsert)) {
      valuesInsert += `${key}='${value}'`;
    } else {
      valuesInsert += `,${key}='${value}'`;
    }
  });
  console.log(`UPDATE mdl_user SET ${valuesInsert} WHERE id=${req.params.id}`);
  try {
    db.query(
      `UPDATE mdl_user SET ${valuesInsert} WHERE id=${req.params.id}`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: "Không tìm thấy user" });
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
const userInfo = async (req, res) => {
  const authHeader = req.header("Authorization");

  const token = authHeader && authHeader.split(" ")[1];
  if (!token)
    return res
      .status(400)
      .json({ success: false, message: "Vui lòng đăng nhập" });
  const decoded = jwt_decode(token);

  db.query(
    `SELECT * FROM mdl_user WHERE username="${decoded.user}"`,
    function (error, results, fields) {
      if (!!error) {
        console.log(error);
        return res
          .status(400)
          .json({ success: false, message: "User not found" });
      } else {
        return res.json({
          success: true,
          message: "Fetch success",

          data: {
            info: {
              username: results[0].username,
              firstName: results[0].firstname,
              lastName: results[0].lastname,
              email: results[0].email,
              phone1: results[0].phone1,
              city: results[0].city,
              country: results[0].country,
              id: results[0].id,
              created: results[0].created,
            },
          },
        });
      }
    }
  );
};

const listStudents = async (req, res) => {
  try {
    db.query(
      `SELECT * FROM mdl_user WHERE deleted=0`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: INTERNAL_ERROR });
        } else {
          let listUsers = results;
          db.query(
            `SELECT userid FROM mdl_cohort_members`,
            (error, results, fields) => {
              if (!!error) {
                return res
                  .status(500)
                  .json({ success: false, message: INTERNAL_ERROR });
              }

              let listNotStudents = [];
              _.map(results, (result) => listNotStudents.push(result?.userid));

              const students = _.filter(
                listUsers,
                (user) => !_.includes(listNotStudents, user?.id)
              );

              let studentsData = _.map(students, (student) => ({
                id: student?.id,
                firstname: student?.firstname,
                lastname: student?.lastname,
                username: student?.username,
                city: student?.city,
                country: student?.country,
                address: student?.address,
                email: student?.email,
                phone1: student?.phone1,
                created: student?.timecreated,
                updated: student?.timemodified,
                suspended: student?.suspended,
              }));

              return res
                .status(200)
                .json({ success: true, data: studentsData });
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

const listTeachers = async (req, res) => {
  try {
    db.query(
      `SELECT * FROM mdl_user WHERE deleted=0`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(400)
            .json({ success: false, message: INTERNAL_ERROR });
        } else {
          let listUsers = results;
          db.query(
            `SELECT userid FROM mdl_cohort_members WHERE cohortid=1`,
            (error, results, fields) => {
              if (!!error) {
                return res
                  .status(500)
                  .json({ success: false, message: INTERNAL_ERROR });
              }

              let listIdTeachers = [];
              _.map(results, (result) => listIdTeachers.push(result?.userid));

              const teachers = _.filter(listUsers, (user) =>
                _.includes(listIdTeachers, user?.id)
              );

              let teachersData = _.map(teachers, (teacher) => ({
                id: teacher?.id,
                firstname: teacher?.firstname,
                lastname: teacher?.lastname,
                username: teacher?.username,
                city: teacher?.city,
                country: teacher?.country,
                address: teacher?.address,
                email: teacher?.email,
                phone1: teacher?.phone1,
                created: teacher?.timecreated,
                updated: teacher?.timemodified,
                suspended: teacher?.suspended,
              }));

              return res
                .status(200)
                .json({ success: true, data: teachersData });
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

const unlockUser = async (req, res) => {
  try {
    db.query(
      `UPDATE mdl_user SET suspended = "${req?.body?.status}" WHERE mdl_user.id = "${req?.body?.id}"`,
      (error, results, fields) => {
        if (!!error) {
          return res
            .status(500)
            .json({ success: false, message: INTERNAL_ERROR });
        } else {
          if (req.body.email) {
            sendMail(
              req?.body?.email,
              `${
                req.body.status === 1
                  ? "Tài khoản Cyberlearning của bạn đã bị khóa"
                  : "Tài khoản Cyberlearning của bạn đã được kích hoạt"
              }`
            );
            return res
              .status(200)
              .json({ success: true, message: "Update successfully!" });
          }
        }
      }
    );
  } catch (error) {
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};

module.exports = {
  editUser,
  userInfo,
  listStudents,
  listTeachers,
  unlockUser,
};
