const { Router }=require("express")
const commentRouter=Router()

const Commentmodel=require("../models/comment.model")
const authorise=require("../middleware/authorization")
const Blogmodel=require("../models/blog.model")

commentRouter.post("/:blogId", authorise(["user", "writer"]),async (req, res) => {

let blogID=req.params.blogId;
let {comment,userId}=req.body;
if(comment==undefined){
    return res.send({msg:"fields missing"})
}
try{
let comment=await Commentmodel({blogID,userId,comment})
await comment.save();
await Blogmodel.findByIdAndUpdate({_id:blogID},{$inc:{comments:1}})
return res.status(201).send({ msg: "Comment posted successfully"})
}
catch(err){
    console.log(err);
    return res.send({msg: "something went wrong"})
}
})

commentRouter.get("/:blogId",async(req,res)=>{

    
})
module.exports={commentRouter};