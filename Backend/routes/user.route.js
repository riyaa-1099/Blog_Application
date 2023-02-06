const express=require("express")
const userRouter=express.Router();

const jwt=require("jsonwebtoken")
const bcrypt=require("bcrypt")

require("dotenv").config();
//userRouter.use(cookieParser())
const otpRouter=require("./otp.route")
const authentication=require("../middleware/authentication")
const {Usermodel}=require("../models/user.model")
const Otpmodel=require("../models/otp.model")

userRouter.post("/signup",async (req,res)=>{
const {email,password,name,role,otp}=req.body;
if(!name||!email||!password ||!otp){
    res.send({msg:"Complete your details",status:"fail"});
    return;
}
const user=await Usermodel.find({email})
if(user.length>=1){
    res.send({"msg":"Sorry, user already exist",status:"fail"});  
}
else{
try{
const findOtp=await Otpmodel.findOne({email})
if(findOtp.otp!=otp){
    return   res.send({ msg: "incorrect otp",status: "error"})
}

bcrypt.hash(password,4,async function(err,hash){
    if (err) {
        console.log(err);
        res.send({ msg: "error while signing in",status: "error",
        });
      }
       else {

const current=new Usermodel({email,role,password:hash,name})
const saved=await current.save();
// let {token,refreshToken}=tokencreate(res,saved._id,saved.role)

res.send({"msg":"Sign-up Successfull"})
      }
  })
}
catch(err){
console.log(err)
res.send({"msg":"Something went wrong"})
     }
  }
});


userRouter.post("/login",async (req,res)=>{
    const {email,password}=req.body;
    if(!email ||!password){
        res.send({ msg: "fill all the fields", status: "fail" });
        return;
    }
    try{
    const user=await Usermodel.find({email})
    if(user.length>0){
       const hashed_pass=user[0].password;
       bcrypt.compare(password,hashed_pass,function(err,result){
        if(result){
        let {token,refreshToken}=tokencreate(res,user[0]._id,user[0].role)  
        
        res.cookie("dummy","yes i do")
     
        res.cookie('token',token, { maxAge: 900000});
        res.cookie('refreshToken',refreshToken, { maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true });
       
        res.send({"msg":"Login Successfull","token":token,"refreshToken":refreshToken})
        }
        else{
            res.send({"msg":"wrong password"})
        }
      })
    }
    else{   
    res.send({"msg":"User not found"}) 
    }
}
    catch(err){
    console.log(err)
    console.log({"msg":"Something went wrong"})
    }
    })


    userRouter.post("/updatepassword",async (req,res)=>{
        const {email,password}=req.body;
        if(!email ||!password){
            res.send({ msg: "fill all the fields", status: "fail" });
            return;
        }
        try{
        const user=await Usermodel.find({email})
        if(user.length>0){
           const hashed_pass=user[0].password;
           bcrypt.compare(password,hashed_pass,function(err,result){
            if(result){
            let {token,refreshToken}=tokencreate(res,user[0]._id,user[0].role)  
            //res.cookie("dummy","yes i do")
           
            // res.cookie('token',randomNumber, { maxAge: 900000, httpOnly: true });
            res.send({"msg":"Login Successfull","token":token,"refreshToken":refreshToken})
            }
            else{
                res.send({"msg":"wrong password"})
            }
           })
        }
        else{   
        res.send({"msg":"User not found"}) 
        }
    }
        catch(err){
        console.log(err)
        console.log({"msg":"Something went wrong"})
        }
        })


function tokencreate(res,userId,role){

  let token = jwt.sign({ userId, role }, process.env.secretKey, {
    expiresIn: "1d",
  });
  let refreshToken = jwt.sign({ userId, role }, process.env.refreshKey, {
    expiresIn: "10d",
  });

  return { token, refreshToken };

    }

    module.exports={
        userRouter
    }
