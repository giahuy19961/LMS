const bcrypt = require("bcryptjs");
const db = require("../db/db.config");
const jwt = require("jsonwebtoken");

const loginUser = async (req, res) => {
  // const { username, password } = req.body;

  if (!req.body.username || !req.body.password)
    return res
      .status(400)
      .json({ success: false, message: "Username and/or password is missing" });
  try {
    db.query(
      `SELECT * FROM mdl_user WHERE username="${req.body?.username}"`,
      function (error, results, fields) {
        if (!!error) {
          console.log(error);
          return res
            .status(400)
            .json({ success: false, message: "User not found" });
        } else {
          isValidPassword = bcrypt.compareSync(
            req.body?.password,
            results[0].password
          );
          if (!isValidPassword) {
            return res
              .status(401)
              .json({ success: false, message: "Unauthorized" });
          }
          const accessToken = jwt.sign(
            { user: results[0].username },
            process.env.JWT_SECRET_KEY
          );
          return res.json({
            success: true,
            message: "Login success",

            data: {
              info: {
                firstName: results[0].firstname,
                lastName: results[0].lastname,
                email: results[0].email,
                phone: results[0].phone1 || results[0].phone2,
                city: results[0].city,
                country: results[0].country,
                id: results[0].id,
              },
              token: accessToken,
            },
          });
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

module.exports = {
  loginUser,
};
