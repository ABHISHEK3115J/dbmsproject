var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');
//const { get } = require('./outing');
const {ensureAuthenticated} = require('../config/auth')

// display books page
router.get('/(:id)',ensureAuthenticated, function(req, res, next) {
      let id =req.params.id;
    dbConn.query('SELECT * FROM Student natural join Visitor WHERE Hostel_ID = '+id,function(err,rows)     {
 
        if(err) {
            // render to views/books/index.ejs
            res.render('visitor',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('visitor',{data:rows,data1:id});
        }
    });
});

router.get('/add/(:ide)/(:id)',ensureAuthenticated, function(req, res, next) {    
    res.render('addVisitor', {
        Visitor_ID:'',
        Visitor_Name: '',
        In_Time:'',
        Out_Time:'',
        Date:'',
        Student_ID:'',
        data1:req.params.ide
    })
})

router.post('/add/(:ide)/(:id)', function(req, res, next) {    
    let Visitor_ID = req.body.Visitor_ID;
    let Visitor_Name = req.body.Visitor_Name;
    let In_Time = req.body.In_Time;
    let Out_Time=req.body.Out_Time;
    let Date = req.body.Date;
    let Student_ID = req.body.Student_ID;
    let errors = false;

    if(Visitor_ID===null||Student_ID===null) {
        errors = true;

        // set flash message
        // render to add.ejs with flash message
        res.render('addVisitor', {
            Visitor_ID:Visitor_ID,
            Visitor_Name: Visitor_Name,
            In_Time:In_Time,
            Out_Time:Out_Time,
            Date:Date,
            Student_ID:Student_ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Visitor_ID:Visitor_ID,
            Visitor_Name: Visitor_Name,
            In_Time:In_Time,
            Out_Time:Out_Time,
            Date:Date,
            Student_ID:Student_ID
        }
        
        // insert query
        dbConn.query('INSERT INTO Visitor SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                req.flash("error_msg","student not in Hostel") 
                // render to add.ejs
                res.render('addVisitor', {
                    Visitor_ID:form_data.Visitor_ID,
                    Visitor_Name: form_data.Visitor_Name,
                    In_Time:form_data.In_Time,
                    Out_Time:form_data.Out_Time,
                    Date:form_data.Date,
                    Student_ID:form_data.Student_ID,
                    data1:req.params.ide
                })
            } else {                
                res.redirect('/visitor/'+req.params.ide);
            }
        })
    }
})

// display edit book page
router.get('/edit/(:ide)/(:Visitor_ID)/(:Student_ID)',ensureAuthenticated, function(req, res, next) {

    let Visitor_ID = req.params.Visitor_ID;
    let Student_ID = req.params.Student_ID;
    dbConn.query('SELECT * FROM Visitor WHERE Visitor_ID = ? and Student_ID = ? ',[Visitor_ID,Student_ID], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/visitor/'+req.params.ide);
        }
        else {
            // render to edit.ejs
            res.render('editVisitor', {
                title: 'Edit Visitor', 
                Visitor_ID:rows[0].Visitor_ID,
                Visitor_Name: rows[0].Visitor_Name,
                In_Time:rows[0].In_Time,
                Out_Time:rows[0].Out_Time,
                Date:rows[0].Date,
                Student_ID:rows[0].Student_ID,
                data1:req.params.ide
            })
        }
    })
})

router.post('/update/(:ide)/(:Visitor_ID)/(:Student_ID)', function(req, res, next) {

    let Visitor_ID = req.body.Visitor_ID;
    let Visitor_Name = req.body.Visitor_Name;
    let In_Time = req.body.In_Time;
    let Out_Time=req.body.Out_Time;
    let Date = req.body.Date;
    let Student_ID = req.body.Student_ID;
    let errors = false;

    if(Student_ID===null||Visitor_ID===null) {
        errors = true;
        
        // set flash message
        res.render('addVisitor', {
            Visitor_ID:Visitor_ID,
            Visitor_Name: Visitor_Name,
            In_Time:In_Time,
            Out_Time:Out_Time,
            Date:Date,
            Student_ID:Student_ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Visitor_ID:Visitor_ID,
            Visitor_Name: Visitor_Name,
            In_Time:In_Time,
            Out_Time:Out_Time,
            Date:Date,
            Student_ID:Student_ID
        }
        dbConn.query('UPDATE Visitor SET ? WHERE Visitor_ID = ? and Student_ID = ? ', [form_data,Visitor_ID,Student_ID], function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                console.log('error')

                // render to edit.ejs
                res.render('editVisitor', {
                    Visitor_ID:form_data.Visitor_ID,
                    Visitor_Name: form_data.Visitor_Name,
                    In_Time:form_data.In_Time,
                    Out_Time:form_data.Out_Time,
                    Date:form_data.Date,
                    Student_ID:form_data.Student_ID,
                    data1:req.params.ide
                })
            } else {
                res.redirect('/visitor/'+req.params.ide);
            }
        })
    }
})
   
router.get('/delete/(:ide)/(:Visitor_ID)/(:Student_ID)',ensureAuthenticated, function(req, res, next) {
    let Visitor_ID = req.params.Visitor_ID;
    let Student_ID = req.params.Student_ID;
     
    dbConn.query('DELETE FROM Visitor WHERE Visitor_ID = ? and Student_ID = ?',[Visitor_ID,Student_ID], function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            res.redirect('/visitor/'+req.params.ide)
        } else {
            
            res.redirect('/visitor/'+req.params.ide)
        }
    })
})

module.exports = router;