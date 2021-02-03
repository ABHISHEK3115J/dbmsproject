var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');
const bodyParser = require('body-parser');
const {ensureAuthenticated} = require('../config/auth')
let ejs = require("ejs");
let pdf = require("html-pdf");
let path = require("path");

router.get("/(:Hostel_ID)", (req, res) => {
  var id  = req.params.Hostel_ID;
  dbConn.query('SELECT * FROM Student where Hostel_ID = ? AND Room_ID IS NOT NULL ORDER BY Room_ID ',[id],function(err,rows)     {
 
    res.render('report-template', {data: rows}, (err, data) => {
      if (err) {
            res.send(err);
      } else {
          let options = {
              "height": "11.25in",
              "width": "8.5in",
              "header": {
                  "height": "20mm"
              },
              "footer": {
                  "height": "20mm",
              },
          };
          pdf.create(data, options).toFile("report.pdf", function (err, data) {
              if (err) {
                  res.send(err);
              } else {
                  res.send("File created successfully");
              }
          });
      }
  });
});
})
module.exports = router;