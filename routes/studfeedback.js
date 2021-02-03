const express = require('express');
const router = express.Router();
var Feedback = require('../models/Feedback')
var Sentiment = require('sentiment');
var sentiment = new Sentiment();
router.get('/(:id)',(req,res)=>{
const Hostel_ID = req.params.id;
res.render('addFeedback',{data:Hostel_ID});
console.log
})
router.post('/(:id)',(req,res)=>{
    const ide = req.user.rvce_ID;
    var result = sentiment.analyze(req.body.Text);
    console.log(result.score);
    var val = '';
    if(result.score>=-5 && result.score<=-1)
       val = 'Negative';
    else if(result.score>=1&&result.score<=5)
       val = 'Positive';
    else
       val = 'Neutral';
    const feed = new Feedback({
        rvce_ID : ide,
        Hostel_ID :req.params.id,
        Text : req.body.Text,
        Type : val
        })
        console.log(feed);
    feed.save();
    //flash message
    res.redirect("/index");
})

module.exports = router;