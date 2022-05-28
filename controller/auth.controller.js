const bcrypt = require("bcryptjs");
const db = require("../db/db.config");
const jwt = require("jsonwebtoken");
const { ROLE } = require("../constants");

const loginUser = async (req, res) => {
  // const { username, password } = req.body;

  if (!req.body?.username || !req.body?.password)
    return res
      .status(400)
      .json({ success: false, message: "Username and/or password is missing" });
  try {
    db.query(
      `SELECT * FROM mdl_user WHERE username="${req?.body?.username}"`,
      function (error, results, fields) {
        if (!!error) {
          console.log(error);
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        } else {
          isValidPassword = bcrypt.compareSync(
            req.body?.password,
            results[0]?.password
          );
          if (!isValidPassword) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }

          if (results[0]?.suspended === 1) {
            return res.status(400).json({
              success: false,
              message: "Account must wait for admin accepted",
            });
          }

          let user = results[0];
          db.query(
            `SELECT * FROM mdl_cohort_members WHERE userid="${user?.id}"`,
            function (error, results, fields) {
              if (!!error) {
                return res
                  .status(500)
                  .json({ success: false, message: "Internal Server error" });
              }
              let role;

              switch (results[0]?.cohortid) {
                case 1:
                  role = ROLE.TEACHER;
                  break;
                case 2:
                  role = ROLE.MANAGER;
                  break;
                default:
                  role = ROLE.STUDENT;
                  break;
              }

              const accessToken = jwt.sign(
                { user: user.username, role },
                process.env.JWT_SECRET_KEY
              );
              return res.json({
                success: true,
                message: "Login success",

                data: {
                  info: {
                    username: user.username,
                    firstName: user.firstname,
                    lastName: user.lastname,
                    email: user.email,
                    phone1: user.phone1,
                    city: user.city,
                    country: user.country,
                    id: user.id,
                    created: user.created,
                    role,
                  },
                  token: accessToken,
                },
              });
            }
          );
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ success: false, message: "Internal Server Error" });
  }
};
const registerUser = async (req, res) => {
  try {
    let passwordHash = bcrypt.hashSync(req.body.password);

    db.query(
      `INSERT INTO mdl_user (username,password,email,suspended) VALUES ('${req?.body.username}','${passwordHash}','${req?.body.email}',1)`,
      (error, results, fields) => {
        if (!!error) {
          console.log(error);
          return res.status(500).json({
            success: false,
            message: "Register failed",
          });
        } else {
          return res
            .status(200)
            .json({ success: true, message: "Register successfully!" });
        }
      }
    );
  } catch (error) {}
};

module.exports = {
  loginUser,
  registerUser,
};
