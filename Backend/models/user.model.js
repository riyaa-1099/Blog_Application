const mongoose=require("mongoose")

const userSchema=mongoose.Schema({
name:String,
email:String,
password:String,
role:{type:String,enum:["admin","writer","user"],default:"user"}
},
{timestamps:true})

const Usermodel=mongoose.model("userlists",userSchema)

module.exports={
    Usermodel
}