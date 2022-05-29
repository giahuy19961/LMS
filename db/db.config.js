const mysql = require("mysql");

const db = mysql.createConnection({
  host: "mariadb-79442-0.cloudclusters.net",
  port: "19046",
  user: "root",
  password: "@12071996Gh",
  database: "moodle",
});

module.exports = db;
