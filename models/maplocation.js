const mongoose = require('mongoose');
const LocationSchema = new mongoose.Schema({
    Hostel_ID:{
     type:String,
     required:true
 },
    Location:{
    type:Array,
    required:true
}

});

const Location = mongoose.model('Location',LocationSchema);
module.exports = Location;