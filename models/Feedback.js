const mongoose = require('mongoose');
const FeedbackSchema = new mongoose.Schema({
 rvce_ID:{
 type:String,
 required:true
 },
    Hostel_ID:{
     type:String,
     required:true
 },
 Text:{
    type:String,
    required:true
},
Type:{
  type:String,
  required:true
},
date:{
    type:Date,
    default:Date.now
}

});

const Feedback = mongoose.model('Feedback',FeedbackSchema);
module.exports = Feedback;