const mongoose = require('mongoose')
const {Schema} = mongoose;

const BookingSchema = new Schema({
    place:{type:mongoose.Schema.Types.ObjectId, required:true},
    checkin:{type:Date, required:true},
    checkout:{type:Date, required:true},
    phone:{type:String, required:true},
    firstname:{type:String, required:true},
    lastname:{type:String, required:true},
    price:{type:Number},
    numberofguests:{type:Number, required:true}
})

const BookingModel = mongoose.model('Booking', BookingSchema);
module.exports=BookingModel;