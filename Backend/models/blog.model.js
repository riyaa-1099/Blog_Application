const mongoose=require("mongoose")

const blogSchema=mongoose.Schema({
topic:String,
content:String,
comments:Number,
userID:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userlists"
},
likes:Number

})
var Blogmodel=mongoose.model("bloglists",blogSchema)

module.exports={
    Blogmodel
}