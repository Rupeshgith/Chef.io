const jwt= require("jsonwebtoken");
const Reggister= require("../models/schema");

const auth= async (req,res,next)=>{
    try{
        const token= req.cookies.jwt;
        const verifyuser= jwt.verify(token,process.env.SECRET_KEY);
        console.log(`verifyuser${verifyuser}`);
        const user= await Reggister.findOne({_id:verifyuser._id});
        req.token= token;
        req.user= user;
        console.log(user);
        next();
    }
    catch(e){
        res.render("404error",{
            content: "Please Login to see your cart",
        });
        
    }

}
module.exports= auth;