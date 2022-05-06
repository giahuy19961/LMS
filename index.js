const express = require("express");
// const mysql = require("mysql");
const db = require("./db/db.config");
var _ = require("lodash");
require("dotenv").config();
const moment = require("moment");
const route = require("./routes");
const cors = require("cors");
const { config } = require("dotenv");


// connect
db.connect((err) => {
  if (err) {
    throw err;
  }
  console.log("MySql Connected");
});

const app = express();

// app.get("/", function (req, res) {
//   db.query("SELECT * FROM mdl_user", function (error, rows, fields) {
//     if (!!error) {
//       console.log(error);
//     } else {
//       let password =
//         "$2y$10$7gahn6nh.06zdSp8dNQN8eyz9m/PC.POpb90C6jAzfI2GbwF9wodO";
//       console.log(bcrypt.compareSync("@12071996Hh", password));
//       let resData = _.map(rows, (item, index) => {
//         return {
//           ...item,
//           timestart: moment(item.timestart)
//             .local()
//             .format("YYYY-MM-DD HH:mm:ss"),
//         };
//       });

//       return res.json({
//         status: 200,
//         data: resData,
//       });
//     }
//   });
// });
app.use(express.json());
app.use(cors());
route(app);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});
