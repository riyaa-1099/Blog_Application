
function authorise(permittedRole){
return (req,res,next)=>{

const role=req.body.role;
//x_userRole
console.log(role,req.body,permittedRole)
if(permittedRole.includes(role)){
    next()
}
else{
    res.status(401).send({msg:"You are not authorized to do this",status:"Fail"})
}

}
}

module.exports=authorise