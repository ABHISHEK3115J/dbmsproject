var express = require('express');
var router = express.Router();
var util = require('util');
var dbConn  = require('../config/db.config');
const {ensureAuthenticated} = require('../config/auth')
// display books page
router.get('/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {
      const query = util.promisify(dbConn.query).bind(dbConn);
(async()=>{ 
    var ide = req.params.Hostel_ID;
    let gender = await query('SELECT * FROM Hostel WHERE Hostel_ID = ?',[ide]);
    console.log(gender);
    let g1 = (gender[0].Hostel_Type=="Boys")? "Male" : "Female";

  dbConn.query('SELECT * FROM Student WHERE Room_ID is NULL and Gender = ?',[g1],function(err,rows)     {

      if(err) {
          // render to views/books/index.ejs
          console.log(err);
          res.render('allocate',{data:''});   
      } else {
          // render to views/books/index.ejs
          res.render('allocate',{data:rows,data1:req.params.Hostel_ID});
      }
  });
})()
      
});

router.get('/add/(:id)/(:ig)',ensureAuthenticated, function(req, res, next) {   
    console.log("HI"); 
    var val = req.params.id;
    dbConn.query('SELECT R.Room_ID FROM Room as R LEFT OUTER JOIN Student as S ON R.Room_ID = S.Room_ID WHERE S.Room_ID IS NULL AND R.Hostel_ID = ? ',[req.params.id],(err,rows)=>{
        console.log(rows);
             res.render('newAllot', {
             Student_ID :'',
             Student_Name  : '',
             Department  : '',
             Gender  : '',
             Backlog  : '',
             CGPA  : '',
             Study_Year :'',
             Mobile_No:'',  
             ID :req.user.rvce_ID,
             Hostel_ID :req.params.id,
             Room_ID :rows,
             data1:val    
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
       let ID = req.body.ID
       let Hostel_ID = req.body.Hostel_ID
       let Room_ID =    req.body.Room_ID
       let errors=false;
    if(Student_ID===null) {
        errors = true;

        // set flash message
        // render to add.ejs with flash message
        res.render('newAllot', {
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
                
                 req.flash("error_msg","query error")
                // render to add.ejs
                console.log(err);
                res.render('newAllot', {
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
                if(Hostel_ID!=null)         
                res.redirect(`/allocate/${Hostel_ID}`);
                else
                  res.redirect('/allocate/'+req.params.ide)
            }
        })
    }
})

// display edit book page
router.get('/edit/(:_id)/(:Student_ID)',ensureAuthenticated, function(req, res, next) {

    let id = req.params.Student_ID;
   
    dbConn.query('SELECT * FROM Student WHERE Student_ID = ?', [id], function(err, birows, fields) {
        if(err) throw err
         
        // if user not found
        if (birows.length <= 0) {
            res.redirect('/allocate/'+req.params._id)
        }
        else {
            // render to edit.ejs
            dbConn.query('SELECT R.Room_ID FROM Room as R LEFT OUTER JOIN Student as S ON R.Room_ID = S.Room_ID WHERE S.Room_ID IS NULL AND R.Hostel_ID = ? ',[req.params._id],(err,rows)=>{
                console.log(rows,birows[0].Backlog);
                     res.render('editAllocate', {
                        Student_ID :id,
                        Student_Name :birows[0].Student_Name,
                        Department :birows[0].Department,
                        Gender  :birows[0].Gender,
                        Backlog  :birows[0].Backlog,
                        CGPA   :birows[0].CGPA,
                        Study_Year :birows[0].Study_Year,
                        Mobile_No :birows[0].Mobile_No,
                        ID :req.user.rvce_ID,
                        Hostel_ID :req.params._id,
                        Room_ID :rows   
                 })

        })
    }
})
})

router.post('/update/(:ide)/(:id)/(:ig)',ensureAuthenticated, function(req, res, next) {

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
    let Room_ID =    req.body.Room_ID
    let errors=false;

    if(Student_ID===null) {
        errors = true;
        
        // set flash message
        res.render('editAllocate', {
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
            Student_ID:Student_ID,
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
                req.flash("error_msg","query error check inputs")
                console.log(err)

                // render to edit.ejs
                res.render('editAllocate', {
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
                if(form_data.Hostel_ID!=null){
                  res.redirect(`/allocate/${Hostel_ID}`);
                }
                else{
                    res.redirect('/allocate/'+req.params.ide);
                }
            }
        })
    }
})
   
router.get('/delete/(:id)/(:Student_ID)',ensureAuthenticated, function(req, res, next) {
    let id = req.params.id;
    let ID = req.params.Student_ID;
    dbConn.query('DELETE FROM Student WHERE Student_ID = ?' ,[ID], function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash("error_msg","error in deleting")
            console.log(err);
            res.redirect(`/allocate/${id}`)

        } else {
            res.redirect(`/allocate/${id}`)
              }
    })
})

module.exports = router;