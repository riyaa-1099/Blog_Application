const nodemailer = require("nodemailer");
require('dotenv').config();
const { Router } = require("express");
const otpRouter = Router();
const Otpmodel=require("../models/otp.model")

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.EMAIL_USERNAME,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


otpRouter.post("/",async(req,res)=>{
let {email}=req.body;
if(email===undefined){
    return res.send({msg:"fields missing"})
}
try{
let current=await Otpmodel.findOne({email});
 otp=Math.floor(Math.random()*(10000-1000))+1000;

if(current?.email){
await Otpmodel.findByIdAndUpdate({_id:current._id},{$set:{otp}});
}
else{
let current2=await Otpmodel({email,otp});
current2.save()
}
sendMail(email,otp);
console.log(email,otp)
res.send({
    msg:"otp sent on email, valid for 5 minutes"})

}
catch(err){
    res.send({msg:"something wrong"})
}
})


async function sendMail(email,otp){
  transporter.sendMail({
    // It should be a string of sender email
    from: "riyasharma49146@gmail.com",

    to: "sharma1099riya@gmail.com",

    subject: "Sending Email using Node.js for otp",

    text:
      `Hi! There, You know I am using this app and otp is ${otp}`,
     
  }, function(error, info) {
    if (error) return console.log(error);
    console.log("Email Sent Successfully");
    console.log(info);
  })
  };

module.exports={otpRouter};