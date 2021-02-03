'use strict';
const mysql = require('mysql');
//local mysql db connection
const dbConn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'M1avatkarr007',
  database : 'hostel',
  port:3306
});
dbConn.connect(function(err) {
  if (err) throw err;
  console.log("Database Connected!");
});
module.exports = dbConn;