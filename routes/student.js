var express = require('express');
var router = express.Router();
var util = require('util');
var dbConn  = require('../config/db.config');
const {ensureAuthenticated} = require('../config/auth')

// display books page
router.get('/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {
      var ide = req.params.Hostel_ID;
    dbConn.query('SELECT * FROM Student WHERE Hostel_ID = ? ORDER BY Student_ID ',[ide],function(err,rows)     {
 
        if(err) {
            // render to views/books/index.ejs
            res.render('student',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('student',{data:rows,data1:req.params.Hostel_ID});
        }
    });
});
router.get('/add/(:ide)/(:id)',ensureAuthenticated, function(req, res, next) {   
    console.log("HI"); 
    dbConn.query('SELECT R.Room_ID FROM Room as R LEFT OUTER JOIN Student as S ON R.Room_ID = S.Room_ID WHERE S.Room_ID IS NULL AND R.Hostel_ID = ? ',[req.params.ide],(err,rows)=>{
   console.log(rows);
        res.render('addStudent', {
        Student_ID :'',
        Student_Name  : '',
        Department  : '',
        Gender  : '',
        Backlog  : '',
        CGPA  : '',
        Study_Year :'',
        Mobile_No:'',  
        ID :req.user.rvce_ID,
        Hostel_ID :req.params.ide,
        Room_ID :rows    
    })
})
})

router.post('/add/(:ide)/(:id)', function(req, res, next) {    
       let Student_ID = req.body.Student_ID;
       let Student_Name  = req.body.Student_Name
       let Department  = req.body.Department
       let Gender  = req.body.Gender
       let Backlog  = req.body.Backlog
       let CGPA   = req.body.CGPA
       let Study_Year = req.body.Study_Year
       let Mobile_No =   req.body.Mobile_No
       let ID = req.user.rvce_ID
       let Hostel_ID = req.params.ide
       let Room_ID =    req.body.Room_ID
       let errors=false;
    if(Student_ID===null) {
        errors = true;

        // set flash message
        req.flash("error_msg","error Student_ID alreay present")
        // render to add.ejs with flash message
        res.render('addStudent', {
             Student_ID : Student_ID,
             Student_Name : Student_Name,
             Department : Department,
             Gender  : Gender,
             Backlog  : Backlog,
             CGPA   : CGPA,
             Study_Year : Study_Year,
             Mobile_No :  Mobile_No,
             ID : ID,
             Hostel_ID : Hostel_ID,
             Room_ID :    Room_ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Student_ID : Student_ID,
            Student_Name : Student_Name,
            Department : Department,
            Gender  : Gender,
            Backlog  : Backlog,
            CGPA   : CGPA,
            Study_Year : Study_Year,
            Mobile_No :  Mobile_No,
            ID : ID,
            Hostel_ID : Hostel_ID,
            Room_ID :    Room_ID
        }
        
        // insert query
        dbConn.query('INSERT INTO Student SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                
                 req.flash("error_msg","query error enter correct details")
                // render to add.ejs
                console.log(err);
                res.render('addStudent', {
                    Student_ID : form_data.Student_ID,
                    Student_Name :form_data.Student_Name,
                    Department :form_data.Department,
                    Gender  : form_data.Gender,
                    Backlog  : form_data.Backlog,
                    CGPA   : form_data.CGPA,
                    Study_Year : form_data.Study_Year,
                    Mobile_No :  form_data.Mobile_No,
                    ID : form_data.ID,
                    Hostel_ID : form_data.Hostel_ID,
                    Room_ID :    form_data.Room_ID
                })
            } else {            
                res.redirect(`/student/${Hostel_ID}`);
            }
        })
    }
})

// display edit book page
router.get('/edit/(:Student_ID)',ensureAuthenticated, function(req, res, next) {

    let id = req.params.Student_ID;
   
    dbConn.query('SELECT * FROM Student WHERE Student_ID = ?', [id], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/student')
        }
        else {
            // render to edit.ejs
            res.render('editStudent', {
                title: 'Edit Student', 
                Student_ID :rows[0].Student_ID,
                Student_Name :rows[0].Student_Name,
                Department :rows[0].Department,
                Gender  :rows[0].Gender,
                Backlog  :rows[0].Backlog,
                CGPA   :rows[0].CGPA,
                Study_Year :rows[0].Study_Year,
                Mobile_No :rows[0].Mobile_No,
                ID :rows[0].ID,
                Hostel_ID :rows[0].Hostel_ID,
                Room_ID :rows[0].Room_ID
            })
        }
    })
})

router.post('/update/(:id)', function(req, res, next) {

    let Student_ID = req.params.id;
    let Student_Name  = req.body.Student_Name
    let Department  = req.body.Department
    let Gender  = req.body.Gender
    let Backlog  = req.body.Backlog
    let CGPA   = req.body.CGPA
    let Study_Year = req.body.Study_Year
    let Mobile_No =   req.body.Mobile_No
    let ID = req.body.ID
    let Hostel_ID = req.body.Hostel_ID
    let Room_ID = req.body.Room_ID
    let errors=false;

    if(Student_ID===null) {
        errors = true;
        
        // set flash message
        res.render('editStudent', {
            Student_ID : Student_ID,
            Student_Name : Student_Name,
            Department : Department,
            Gender  : Gender,
            Backlog  : Backlog,
            CGPA   : CGPA,
            Study_Year : Study_Year,
            Mobile_No :  Mobile_No,
            ID : ID,
            Hostel_ID : Hostel_ID,
            Room_ID :    Room_ID
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Student_Name : Student_Name,
            Department : Department,
            Gender  : Gender,
            Backlog  : Backlog,
            CGPA   : CGPA,
            Study_Year : Study_Year,
            Mobile_No :  Mobile_No,
            ID : ID,
            Hostel_ID : Hostel_ID,
            Room_ID :    Room_ID
        }
        // update query
        dbConn.query('UPDATE Student SET ? WHERE Student_ID = ? ' ,[form_data, Student_ID], function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                console.log(err)
                req.flash("error_msg","query error enter correct details")
                // render to edit.ejs
                res.render('editStudent', {
                    Student_ID : form_data.Student_ID,
                    Student_Name :form_data.Student_Name,
                    Department :form_data.Department,
                    Gender  : form_data.Gender,
                    Backlog  : form_data.Backlog,
                    CGPA   : form_data.CGPA,
                    Study_Year : form_data.Study_Year,
                    Mobile_No :  form_data.Mobile_No,
                    ID : form_data.ID,
                    Hostel_ID : form_data.Hostel_ID,
                    Room_ID :    form_data.Room_ID
                })
            } else {
                res.redirect('/student/'+Hostel_ID);
            }
        })
    }
})
   
router.get('/delete/(:Student_ID)',ensureAuthenticated, function(req, res, next) {

    let ID = req.params.Student_ID;
    const query = util.promisify(dbConn.query).bind(dbConn);
(async()=>{
    let id1 = await query('SELECT * FROM Student WHERE Student_ID = ?',[ID])
    let id = id1[0].Hostel_ID;
   dbConn.query('DELETE FROM Student WHERE Student_ID = ?' ,[ID], function(err, result) {
       //if(err) throw err
       if (err) {
           console.log(err);
           res.redirect(`/student/${id}`)

       } else {
           res.redirect(`/student/${id}`)
             }
   })
})()
    
})



module.exports = router;