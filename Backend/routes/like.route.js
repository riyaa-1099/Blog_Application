const { Router }=require("express")
const likesRouter=Router()

const Commentmodel=require("../models/comment.model")
const authorise=require("../middleware/authorization")
const Blogmodel=require("../models/blog.model")

likesRouter.post("/:blogId", authorise(["user", "writer"]),async (req, res) => {

let blogID=req.params.blogId;
let { userId } = req.body;

try{
let blog=await Blogmodel.findById({_id:blogID})

if(await blog.likes.includes(userId)){
    await Blogmodel.findByIdAndUpdate(
        { _id: blogID },
        { $pull: { likes: userId } }
      );
      return res
        .status(201)
        .send({ msg: "unliked operation successfully", status: "success" });
    } else {
      await Blogmodel.findByIdAndUpdate(
        { _id: blogID },
        { $push: { likes: userId } }
      );
        
return res.status(201)
.send({ msg: "Comment posted successfully"})
}
}
catch(err){
    console.log(err);
    return res.status(500).send({msg: "something went wrong"})
}
})

likesRouter.get("/:blogId",async(req,res)=>{
   
})

module.exports={likesRouter};