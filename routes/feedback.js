const express = require('express');
const Feedback = require('../models/Feedback');
const router = express.Router();
var Sentiment = require('sentiment');
var sentiment = new Sentiment();

router.get('/(:Hostel_ID)',(req,res)=>{
        Feedback.find({Hostel_ID:req.params.Hostel_ID,Type:'Positive'},function(err,list){
        if (err){
            console.log(err);
            res.render('feedback',{data:'',ide:req.params.Hostel_ID});
        }else{
            console.log("Hi");
            res.render('feedback',{data:list,ide:req.params.Hostel_ID});
        }
        });
	});
	router.get('/Negative/(:Hostel_ID)',(req,res)=>{
        Feedback.find({Hostel_ID:req.params.Hostel_ID,Type:'Negative'},function(err,list){
        if (err){
            console.log(err);
            res.render('negativefeedback',{data:'',ide:req.params.Hostel_ID});
        }else{
            console.log("Negative");
            res.render('negativefeedback',{data:list,ide:req.params.Hostel_ID});
        }
        });
	});
	router.get('/Neutral/(:Hostel_ID)',(req,res)=>{
        Feedback.find({Hostel_ID:req.params.Hostel_ID,Type:'Neutral'},function(err,list){
        if (err){
            console.log(err);
            res.render('neutralfeedback',{data:'',ide:req.params.Hostel_ID});
        }else{
            console.log("Neutral");
            res.render('neutralfeedback',{data:list,ide:req.params.Hostel_ID});
        }
        });
    });
//Edit
router.get("/edit/(:_id)",(req,res)=>{
	Feedback.findById(req.params._id,(err,foundfeedback)=>{
		if(err){
			req.flash("error","Something went wrong");
			res.redirect("/feedback");
		}else{
			console.log(foundfeedback);
			res.render('editfeedback',{data:foundfeedback});
		}
	});
});
//Update
router.post("/update/(:id)",(request,respond)=>{
	var result = sentiment.analyze(req.body.Text);
    var val = '';
    if(result<=5 && result>=1)
       val = 'Negative';
    else if(result>=1&&result<=5)
       val = 'Positive';
    else
       val = 'Neutral';
	Feedback.findByIdAndUpdate(request.params.id,{rvce_ID:request.body.rvce_ID,Hostel_ID:request.body.Hostel_ID,Text:request.body.Text,Type:val},(err,updatedComment)=>{
		if(err){
            console.log(err);
			//respond.redirect("back");
		}else{
			respond.redirect("/feedback/"+request.body.Hostel_ID);
		}
	});
});
//Delete
router.get("/delete/(:Hostel_ID)/(:_id)",(request,respond)=>{
	console.log(request.params._id)
	Feedback.findByIdAndRemove(request.params._id,(err)=>{
		if(err){
			console.log(err);
		//	respond.redirect("");
		}else{
			request.flash("success","Successfully deleted Feedback");
			respond.redirect("/feedback/"+request.params.Hostel_ID);
		}
	});
});






module.exports = router;