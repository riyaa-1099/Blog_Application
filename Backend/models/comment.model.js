const mongoose =require("mongoose");

const CommentSchema=mongoose.Schema({
comment:String,
blogId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"bloglist"
},
userId:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"userlist"
}

})

const Commentmodel =mongoose.model("comments",CommentSchema);

module.exports = {Commentmodel}