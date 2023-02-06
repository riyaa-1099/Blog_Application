const {Router}=require("express");

const authorise=require("../middleware/authorization");
const Usermodel=require("../models/user.model");

const adminRouter=Router();

adminRouter.get("./allusers",authorise(["admin"]),async(req,res)=>{
try{
let users=await Usermodel.find({role:{$ne:"admin"}});
res.send({msg:"All users fetched successfully",status:"error"})

}
catch(err){
    res.send({ msg: "something went wrong", status: "error" });
}
})

adminRouter.patch("/user/:userId", authorise(["admin"]),async (req, res) => {
      try {
        let userId = req.params.userId;
        let { name, email, role } = req.body;
  
        let response = await UserModel.findByIdAndUpdate(
          { _id: userId },
          { $set: { name, email, role } }
        );
        res.send({ msg: "user updated successfully", status: "success" });
      } 
      catch (err) {
        res.send({ msg: "something went wrong", status: "error" });
        console.log(err);
      }
    }
  );

  adminRouter.delete("/user/:userId", authorise(["admin"]),async (req, res) => {
      try {
        let userId = req.params.userId;
  
        let resp = await UserModel.findByIdAndDelete( { _id: userId } )
        res.send({ msg: "user deleted successfully", status: "success" });
      } catch (err) {
        res.send({ msg: "something went wrong", status: "error" });
        console.log(err);
      }
    }
  );
  module.exports = {adminRouter}