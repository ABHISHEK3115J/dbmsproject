const express = require('express');
const router = express.Router();
var Location = require('../models/maplocation')
router.get('/',(req,res)=>{
Location.find((err,rows)=>{
    res.render('allHostelLoc',{data:rows});
})
})
router.get('/map/(:id)',(req,res)=>{
    Location.find({Hostel_ID:req.params.id},(err,rows)=>{
      console.log(rows);
      res.render('gmap',{data:rows});
    })
})

router.post('/add',(req,res)=>{
    var locate = new Array(req.body.Longitude,req.body.Latitude);
    const Loc = new Location({
        Hostel_ID :req.body.Hostel_ID,
        Location : locate,
        })
    Loc.save();
    //flash message
    res.redirect("/location");
})
//Edit
router.get("/edit/(:_id)",(req,res)=>{
Location.findById(req.params._id,(err,foundfeedback)=>{
    if(err){
        req.flash("error","Something went wrong");
        res.redirect("/");
    }else{
        console.log(foundfeedback);
        res.render('editLocation',{data:foundfeedback});
    }
});
});
//Update
router.post("/update/(:id)",(request,respond)=>{
    var locate = new Array(request.body.Longitude,request.body.Latitude);
    Location.findByIdAndUpdate(request.params.id,{Hostel_ID:request.body.Hostel_ID,Location:locate},(err,updatedComment)=>{
    if(err){
        console.log(err);
        //respond.redirect("back");
    }else{
        respond.redirect("/location");
    }
});
});
//Delete
router.get("/delete/(:_id)",(request,respond)=>{
console.log(request.params._id)
Location.findByIdAndRemove(request.params._id,(err)=>{
    if(err){
        console.log(err);
    //	respond.redirect("");
    }else{
        request.flash("success","Successfully deleted Feedback");
        respond.redirect("/location");
    }
});
});

module.exports = router;