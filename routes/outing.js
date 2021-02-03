var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');
const {ensureAuthenticated} = require('../config/auth')

// display books page
router.get('/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {
      let id =req.params.Hostel_ID;
    dbConn.query('SELECT * FROM Student natural join Outing WHERE Hostel_ID = ?',[id],function(err,rows)     {
 
        if(err) {
            // render to views/books/index.ejs
            res.render('outing',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('outing',{data:rows});
        }
    });
});

router.get('/add/(:id)',ensureAuthenticated, function(req, res, next) {    
    res.render('addOuting', {
        In_Time:'',
        Out_Time:'',
        In_Date:'',
        Out_Date:'',
        Student_ID:''
    })
})

router.post('/add/(:id)', function(req, res, next) {    
    let In_Time = req.body.In_Time;
    let Out_Time=req.body.Out_Time;
    let In_Date = req.body.In_Date;
    let Out_Date = req.body.Out_Date;
    let Student_ID = req.body.Student_ID;
    let errors = false;

    if(Student_ID===null) {
        errors = true;

        // set flash message
        // render to add.ejs with flash message
        res.render('addOuting', {
            In_Time:In_Time,
            Out_Time:Out_Time,
            In_Date:In_Date,
            Out_Date:Out_Date,
            Student_ID:Student_ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            In_Time:In_Time,
            Out_Time:Out_Time,
            In_Date:In_Date,
            Out_Date:Out_Date,
            Student_ID:Student_ID
        }
        
        // insert query
        dbConn.query('INSERT INTO Outing SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                
                 console.log(err);
                // render to add.ejs
                res.render('addOuting', {
                    In_Time:form_data.In_Time,
                    Out_Time:form_data.Out_Time,
                    In_Date:form_data.In_Date,
                    Out_Date:form_data.Out_Date,
                    Student_ID:form_data.Student_ID
                })
            } else { 
              dbConn.query('SELECT Hostel_ID FROM Student WHERE Student_ID = ?',Student_ID,function(err,result){
                  let id = result[0].Hostel_ID;
                  res.redirect('/outing/'+id);
              })               
            }
        })
    }
})

// display edit book page
router.get('/edit/(:Student_ID)',ensureAuthenticated, function(req, res, next) {

    let Student_ID = req.params.Student_ID;
    dbConn.query('SELECT * FROM Outing WHERE Student_ID = ? ',[Student_ID], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/outing')
        }
        else {
            // render to edit.ejs
            res.render('editOuting', {
                title: 'Edit Outing', 
                In_Time:rows[0].In_Time,
                Out_Time:rows[0].Out_Time,
                In_Date:rows[0].In_Date,
                Out_Date:rows[0].Out_Date,
                Student_ID:rows[0].Student_ID
            })
        }
    })
})

router.post('/update/(:Student_ID)', function(req, res, next) {

    let In_Time = req.body.In_Time;
    let Out_Time=req.body.Out_Time;
    let In_Date = req.body.In_Date;
    let Out_Date = req.body.Out_Date;
    let Student_ID = req.body.Student_ID;
    let errors = false;

    if(Student_ID===null) {
        errors = true;
        
        // set flash message
        res.render('addOuting', {
            In_Time:In_Time,
            Out_Time:Out_Time,
            In_Date:In_Date,
            Out_Date:Out_Date,
            Student_ID:Student_ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            In_Time:In_Time,
            Out_Time:Out_Time,
            In_Date:In_Date,
            Out_Date:Out_Date,
            Student_ID:Student_ID
        }
        dbConn.query('UPDATE Outing SET ? WHERE Student_ID = ? ', [form_data,Student_ID], function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                console.log(err)

                // render to edit.ejs
                res.render('editOuting', {
                    In_Time:form_data.In_Time,
                    Out_Time:form_data.Out_Time,
                    In_Date:form_data.In_Date,
                    Out_Date:form_data.Out_Date,
                    Student_ID:form_data.Student_ID
                })
            } else {
                dbConn.query('SELECT Hostel_ID FROM Student WHERE Student_ID = ?',Student_ID,function(err,result){
                    let id = result[0].Hostel_ID;
                    res.redirect('/outing/'+id);            
        });
    }

})}})
   
router.get('/delete/(:Student_ID)',ensureAuthenticated, function(req, res, next) {
    let Student_ID = req.params.Student_ID;
    let id = []
    dbConn.query('SELECT Hostel_ID FROM Student WHERE Student_ID = ?',Student_ID,function(err,result){
     id = result[0].Hostel_ID;
    })
    console.log(id);
    dbConn.query('DELETE FROM Outing WHERE  Student_ID = ?',[Student_ID], function(err, result) {
        //if(err) throw err
             if (err) {
                // set flash message
    
                res.redirect('/outing/'+id)
            } else {
                
                res.redirect('/outing/'+id)
            }
        })
})

module.exports = router;