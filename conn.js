var mysql = require('mysql');

// DB Connection
var con = mysql.createConnection({
  host: process.env.ADDRESS || "localhost",
  user: process.env.MYSQL_USER || "root",
  password: process.env.MYSQL_PASS || "HolyHawktaw123",
  database: process.env.MYSQL_DATABASE || "wstransaction",
  port: process.env.MYSQL_HOST_PORT || 3306,
});

con.connect(function (err){
    if(err) throw err;
});

module.exports = con;