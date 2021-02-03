var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');
//const { ensureIndexes } = require('../models/User');
const {ensureAuthenticated} = require('../config/auth')


router.get('/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {
      let id =req.params.Hostel_ID;
    dbConn.query('SELECT * FROM Room WHERE Hostel_ID = ? ORDER BY Room_ID ',[id],function(err,rows)     {
 
        if(err) {
            res.render('room',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('room',{data:rows,data1:req.params.Hostel_ID});
        }
    });
});

router.get('/add/(:ide)/(:id)',ensureAuthenticated, function(req, res, next) {  
    res.render('addRoom', {
       Hostel_ID:req.params.ide,
       Room_ID: '',   
    })
})

router.post('/add/(:id)', function(req, res, next) {    
    console.log("body",req.body);  
    let Hostel_ID = req.body.Hostel_ID;
    let Room_ID = req.body.Room_ID;
    let errors = false;

    if(Hostel_ID===null||Room_ID===null) {
        errors = true;

        // set flash message
        // render to add.ejs with flash message
        res.render('addRoom', {
            Hostel_ID:Hostel_ID,
            Room_ID: Room_ID,
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Hostel_ID:Hostel_ID,
            Room_ID: Room_ID,
        }
        
        // insert query
        dbConn.query('INSERT Room SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                
                 
                // render to add.ejs
                res.render('addRoom', {
                    Hostel_ID:form_data.Hostel_ID,
                    Room_ID: form_data.Room_ID,
                })
            } else {                
                res.redirect('/room/'+Hostel_ID);
            }
        })
    }
})

// display edit book page
router.get('/edit/(:Hostel_ID)/(:Room_ID)',ensureAuthenticated, function(req, res, next) {

    let Hostel_ID = req.params.Hostel_ID;
    let Room_ID =req.params.Room_ID;
    console.log(Hostel_ID,Room_ID);
    dbConn.query('SELECT * FROM Room WHERE Hostel_ID = ? and Room_ID = ?',[Hostel_ID,Room_ID], function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/room/'+Hostel_ID)
        }
        else {
            // render to edit.ejs
            res.render('editRoom', {
                title: 'Edit Room', 
               Hostel_ID: rows[0].Hostel_ID,
               Room_ID: rows[0].Room_ID
            })
        }
    })
})

router.post('/update/(:Hostel_ID)/(:Room_ID)', function(req, res, next) {

    let Hostel_ID = req.body.Hostel_ID;
    let Room_ID = req.body.Room_ID;
    let errors = false;
    console.log(Hostel_ID,Room_ID);
    if(Hostel_ID===null||Room_ID===null) {
        errors = true;
        
        // set flash message
        res.render('editRoom', {
            Hostel_ID: req.params.Hostel_ID,
            Room_ID: Room_ID,
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Hostel_ID:Hostel_ID,
            Room_ID: Room_ID,
        }
        // update query
        dbConn.query('UPDATE Room SET ? WHERE Hostel_ID = ?',[form_data,Hostel_ID], function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                    req.flash("error_msg","query error re enter details")
                // render to edit.ejs
                res.render('editRoom', {
                    Hostel_ID: form_data.Hostel_ID,
                    Room_ID: form_data.Room_ID,
                })
            } else {
                console.log('redirecting')
                res.redirect('/room/'+Hostel_ID);
            }
        })
    }
})
   
router.get('/delete/(:Hostel_ID)/(:Room_ID)',ensureAuthenticated, function(req, res, next) {

    let Hostel_ID = req.params.Hostel_ID;
    let Room_ID = req.params.Room_ID;
     
    dbConn.query('DELETE FROM Room WHERE Hostel_ID = ? and Room_ID = ? ',[Hostel_ID,Room_ID], function(err, result) {
        //if(err) throw err
        if (err) {
            console.log(err);
            // set flash message
            res.redirect('/room/'+Hostel_ID)
        } else {
            
            res.redirect('/room/'+Hostel_ID)
        }
    })
})

module.exports = router;