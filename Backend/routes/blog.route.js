const express=require("express")
const todoRouter=express.Router();

const authorise=require("../middleware/authorization")
const {Blogmodel}=require("../models/blog.model")

todoRouter.get("/",async(req,res)=>{
    const Blogs=await Blogmodel.find()
    res.send({"Notes":Blogs,status:"success"})
})

todoRouter.post("/post",authorise(['writer']),async(req,res)=>{
const payload=req.body;
try{
    const new_todo=new Blogmodel(payload);
    await new_todo.save();
    res.send({"msg":"Blog Created successfully"})
}
catch(err){
    console.log(err)
    res.send({"msg":"something wrong!!"})
}
})

todoRouter.delete("/admin/delete/:todoID",authorise("admin"),async(req,res)=>{
    const todoID=req.params.todoID;

    await Blogmodel.findByIdAndDelete({_id:todoID})
    res.send({"msg":"Todo deleted successfully!!"}) 
})

todoRouter.patch("/patch/:blogID",authorise(['writer']),async(req,res)=>{
const blogID=req.params.todoID;
const payload=req.body;
const userID=req.body.userID;
console.log(userID)
const todom=await Blogmodel.findOne({_id:blogID})
console.log(todom)
if(userID!==todom.userID){
    res.send({"msg":"Not authorised!!"}) 
}
else{

    await Blogmodel.findByIdAndUpdate({_id:blogID},payload)
    res.send({"msg":"Todo updated successfully!!"}) 
}
})

todoRouter.delete("/delete/:blogID", authorise(["writer", "admin"]),async(req,res)=>{
    const blogID=req.params.blogID;
    const userID=req.body.userID;
    const blog=await Blogmodel.findOne({_id:blogID})
try{
if(req.user.role=="admin" || userID==blog.userID){
      await Blogmodel.findByIdAndDelete({_id:todoID})
    res.send({"msg":"Todo deleted successfully!!",status:"success"}) 
}
else if(userID!==blog.userID){
    res.send({"msg":"Not authorised!!",status:"fail"}) 
}
}
catch(err){
    res.send({ msg: "error while deleting try again", status: "error" });
}
})

module.exports={
    todoRouter
}