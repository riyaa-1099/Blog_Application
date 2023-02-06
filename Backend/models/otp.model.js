const mongoose=require("mongoose");

const Otpschema=new mongoose.Schema({

    email:String,
    otp:Number
})


const Otpmodel = mongoose.model("otps", Otpschema);

module.exports = Otpmodel;