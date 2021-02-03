var express = require('express');
var router = express.Router();
var dbConn  = require('../config/db.config');
const {ensureAuthenticated} = require('../config/auth');
const flash = require('express-flash');
router.get('/',ensureAuthenticated, function(req, res, next) {
      
    dbConn.query('SELECT * FROM ADMIN ORDER BY ID ',function(err,rows)     {
 
        if(err) {
            res.render('admin',{data:''});   
        } else {
            res.render('admin',{data:rows});
        }
    });
});

router.get('/add',ensureAuthenticated, function(req, res, next) {    
    res.render('addAdmin', {
        ID:'',
        Name: '',
        Email:'',
        Mobile_No:''     
    })
})

router.post('/add', function(req, res, next) {    
    let ID = req.body.ID;
    let Name = req.body.Name;
    let Email = req.body.Email;
    let Mobile_No=req.body.Mobile_No;
    let errors = false;

    if(Name.length === 0 || Email.length === 0) {
        errors = true;

        // set flash message
        req.flash("error_msg","entered name and emal lengths are invalid")
        // render to add.ejs with flash message
        res.render('addAdmin', {
            ID:ID,
            Name: Name,
            Email: Email,
            Mobile_No:Mobile_No
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            ID:ID,
            Name: Name,
            Email: Email,
            Mobile_No:Mobile_No
        }
        
        // insert query
        dbConn.query('INSERT INTO ADMIN SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                
                 
                // render to add.ejs
                res.render('addAdmin', {
                    ID:form_data.ID,
                    Name: form_data.Name,
                    Email: form_data.Email,
                    Mobile_No:form_data.Mobile_No
                })
            } else {                
                res.redirect('/admin');
            }
        })
    }
})

// display edit book page
router.get('/edit/(:ID)',ensureAuthenticated, function(req, res, next) {

    let id = req.params.ID;
   
    dbConn.query('SELECT * FROM ADMIN WHERE ID = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/admin')
        }
        else {
            // render to edit.ejs
            res.render('editAdmin', {
                title: 'Edit Admin', 
                ID: rows[0].ID,
                Name: rows[0].Name,
                Email: rows[0].Email,
                Mobile_No:rows[0].Mobile_No
            })
        }
    })
})

router.post('/update/(:ID)', function(req, res, next) {

    let ID = req.params.ID;
    let Name = req.body.Name;
    let Email = req.body.Email;
    let Mobile_No = req.body.Mobile_No
    let errors = false;

    if(ID===null) {
        errors = true;
        
        // set flash message
        req,flash("error_msg","ID is required")
        res.render('editAdmin', {
            ID: req.params.ID,
            Name: Name,
            Email: Email,
            Mobile_No: Mobile_No
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            ID:ID,
            Name: Name,
            Email: Email,
            Mobile_No:Mobile_No
        }
        // update query
        dbConn.query('UPDATE ADMIN SET ? WHERE ID = ' + ID, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                console.log('error')

                // render to edit.ejs
                res.render('editAdmin', {
                    ID: req.params.ID,
                    Name: form_data.Name,
                    Email: form_data.Email,
                    Mobile_No:form_data.Mobile_No
                })
            } else {
                res.redirect('/admin');
            }
        })
    }
})
   
router.get('/delete/(:ID)',ensureAuthenticated, function(req, res, next) {

    let ID = req.params.ID;
     
    dbConn.query('DELETE FROM ADMIN WHERE ID = ' + ID, function(err, result) {
        //if(err) throw err
        if (err) {
            req.flash("error_msg","error in deleting")
            res.redirect('/admin')
        } else {
            
            res.redirect('/admin')
        }
    })
})

module.exports = router;