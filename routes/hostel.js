var express = require('express');
let appp=express();
var router = express.Router();
var dbConn  = require('../config/db.config');
const bodyParser = require('body-parser');
const {ensureAuthenticated} = require('../config/auth')

// display books page
//appp.use(bodyParser)

router.get('/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {
      let id = req.params.Hostel_ID;
    dbConn.query('SELECT * FROM Hostel where Hostel_ID = ? ORDER BY Hostel_ID ',[id],function(err,rows)     {
 
        if(err) {
            // render to views/books/index.ejs
            res.render('hostel',{data:''});   
        } else {
            // render to views/books/index.ejs
            res.render('hostel',{data:rows});
        }
    });
});

router.get('/add/(:id)',ensureAuthenticated, function(req, res, next) {    
    res.render('addHostel', {
        Hostel_ID:'',
        Hostel_Name: '',
        Hostel_Type:'',
        ID:''
    })
})

router.post('/add/(:id)', function(req, res, next) {    
    let Hostel_ID = req.body.Hostel_ID;
    let Hostel_Name = req.body.Hostel_Name;
    let Hostel_Type = req.body.Hostel_Type;
    let ID=req.body.ID;
    let errors = false;
   console.log(Hostel_ID,Hostel_Name,Hostel_Type,ID)
    if(Hostel_ID===null) {
        errors = true;

        // set flash message
        // render to add.ejs with flash message
        res.render('addHostel', {
            Hostel_ID:Hostel_ID,
            Hostel_Name: Hostel_Name,
            Hostel_Type:Hostel_Type,
            ID:ID
        })
    }

    // if no error
    if(!errors) {

        var form_data = {
            Hostel_ID:req.body.Hostel_ID,
            Hostel_Name: Hostel_Name,
            Hostel_Type:Hostel_Type,
            ID:ID
        }
        
        // insert query
        dbConn.query('INSERT INTO Hostel SET ?', form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                
                 console.log(err);
                // render to add.ejs
                res.render('addHostel', {
                    Hostel_ID:form_data.Hostel_ID,
                    Hostel_Name: form_data.Hostel_Name,
                    Hostel_Type:form_data.Hostel_Type,
                    ID:form_data.ID
                
                })
            } else {                
                res.redirect(`/hostel/${Hostel_ID}`);
            }
        })
    }
})

// display edit book page
router.get('/edit/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {

    let id = req.params.Hostel_ID;
    dbConn.query('SELECT * FROM Hostel WHERE Hostel_ID = ' + id, function(err, rows, fields) {
        if(err) throw err
         
        // if user not found
        if (rows.length <= 0) {
            res.redirect('/hostel')
        }
        else {
            // render to edit.ejs
            res.render('editHostel', {
                title: 'Edit Hostel', 
                Hostel_ID:rows[0].Hostel_ID,
                Hostel_Name: rows[0].Hostel_Name,
                Hostel_Type:rows[0].Hostel_Type,
                ID:rows[0].ID
            })
        }
    })
})

router.post('/update/(:Hostel_ID)', function(req, res, next) {

    let Hostel_ID = req.params.Hostel_ID;
    let Hostel_Name = req.body.Hostel_Name;
    let Hostel_Type = req.body.Hostel_Type;
    let ID = req.body.ID
    let errors = false;

    if(Hostel_ID===null) {
        errors = true;
        
        // set flash message
        res.render('editHostel', {
            Hostel_ID:Hostel_ID,
            Hostel_Name: Hostel_Name,
            Hostel_Type:Hostel_Type,
            ID:ID
        })
    }

    // if no error
    if( !errors ) {   
 
        var form_data = {
            Hostel_ID:Hostel_ID,
            Hostel_Name: Hostel_Name,
            Hostel_Type:Hostel_Type,
            ID:ID
        }
        // update query
        dbConn.query('UPDATE Hostel SET ? WHERE Hostel_ID = ' + Hostel_ID, form_data, function(err, result) {
            //if(err) throw err
            if (err) {
                // set flash message
                console.log(err)

                // render to edit.ejs
                res.render('editHostel', {
                    Hostel_ID:form_data.Hostel_ID,
                    Hostel_Name: form_data.Hostel_Name,
                    Hostel_Type:form_data.Hostel_Type,
                    ID:form_data.ID
                })
            } else {
                res.redirect(`/hostel/${Hostel_ID}`);
            }
        })
    }
})
   
router.get('/delete/(:Hostel_ID)',ensureAuthenticated, function(req, res, next) {

    let Hostel_ID = req.params.Hostel_ID;
     
    dbConn.query('DELETE FROM Hostel WHERE Hostel_ID = ' + Hostel_ID, function(err, result) {
        //if(err) throw err
        if (err) {
            // set flash message
            res.redirect(`/hostel/${Hostel_ID}`)
        } else {
            
            res.redirect('/hostel')
        }
    })
})

module.exports = router;