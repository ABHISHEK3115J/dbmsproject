const express =require('express');
const router =express.Router()
const util = require('util')
const db = require('../config/db.config')
const {ensureAuthenticated} = require('../config/auth');
router.get('/',ensureAuthenticated, function(req, res, next) {
      const query = util.promisify(db.query).bind(db);
      (async () =>{
    let id2 = await req.user.rvce_ID;
    console.log("id2",id2);
    let id1 = await query('SELECT * FROM ADMIN WHERE ID LIKE ?', [id2]);
        console.log("id1",id1);  
        if(id1!=''&&id1[0].ID==id2){
        db.query('SELECT * FROM Hostel ORDER BY Hostel_ID ',function(err,rows)     {
          console.log("in index");
            if(err) {
                // render to views/books/index.ejs
                res.render('index',{data:''});   
            } else {
                // render to views/books/index.ejs
                res.render('index',{data:rows});
            }
        });}
        else{ 
            var ide = req.user.rvce_ID;
            console.log("in student interface");
            db.query('SELECT * FROM Student WHERE Student_ID = ? ',[ide],function(err,rows)     {
          
                if(err) {
                    // render to views/books/index.ejs
                    console.log(err)
                    res.render('studentInterface',{data:''});   
                } else {
                    console.log(rows);
                    // render to views/books/index.ejs
                    res.render('studentInterface',{data:rows});
                }
            });
        }
      })()
    
});
router.get('/(:Hostel_ID)',ensureAuthenticated, function(req,res,next){
   res.render('index1',{Hostel_ID:req.params.Hostel_ID});
});

router.get('/studentInterface',function(req,res,next){
    res.render('studentInterface');
})
module.exports = router;