var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');


router.get('/',(req,res)=>{
    res.render('hostelRegistration');
})

router.post('/', (req, res, next)=> {  
    let Student_ID =  req.user.rvce_ID;
    let Student_Name  = req.body.Student_Name
    let Department  = req.body.Department
    let Gender  = req.body.Gender
    let Backlog  = req.body.Backlog
    let CGPA   = req.body.CGPA
    let Study_Year = req.body.Study_Year
    let Mobile_No =   req.body.Mobile_No
    
if(Mobile_No.length>10)
res.render('hostelRegistration');
     var form_data = {
         Student_ID : Student_ID,
         Student_Name : Student_Name,
         Department : Department,
         Gender  : Gender,
         Backlog  : Backlog,
         CGPA   : CGPA,
         Study_Year : Study_Year,
         Mobile_No :  Mobile_No,
     }
     
     // insert query
     dbConn.query('INSERT INTO Student SET ?', form_data, function(err, result) {
         //if(err) throw err
         if (err) {
             req.flash("error_msg","query error re enter details")              
             console.log(err);
            res.redirect('hostelRegistration')
         } else {            
             res.redirect('/index');
         }
     })
 
})
module.exports = router;