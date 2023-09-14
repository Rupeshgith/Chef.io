const mongoose= require("mongoose");
const bcrypt = require('bcryptjs');
const validator= require("validator");
const jwt = require('jsonwebtoken');



const wetschema= new mongoose.Schema({
    firstname:{
        type:String,
        required: [true, "Please Enter Your Name"],
        lowercase:true,trim:true,/////// jo user likhe uss per automatically ye propperty applied
        minLength: [4, "Name should have more than 4 characters"],
    },
    
    email:{
        type:String, required:true,unique:true
        
    },
    
    password:{
        type:String, required:true,
        minLength: [5, "Password should be greater than 5 characters"],
    },
    cpassword:{
        type:String, required:true,
        minLength: [5, "Password should be greater than 5 characters"],
    },
    tokens: [{
        tokeni:{
            type:String, required:true,
        }
    }]
    
})


///// middleware for jwt
console.log(process.env.SECRET_KEY);
wetschema.methods.generateAuthToken= async function(){
   try{
    const token= jwt.sign({_id: this._id.toString()},process.env.SECRET_KEY);
    this.tokens= this.tokens.concat({tokeni:token});
    await this.save();
    return token;

   }catch(e){
    console.log(e);
   }

}

///// middleware for password
wetschema.pre("save",async function(next){
    if(this.isModified("password")){
   // const hash= await bcrypt.hash(this.password,10);
    console.log(`${this.password}`);
    this.password= await bcrypt.hash(this.password,10);
    }
    next();
})

///// middleware for cpassword
wetschema.pre("save",async function(next){
    if(this.isModified("cpassword")){
   // const hash= await bcrypt.hash(this.password,10);
    console.log(`${this.cpassword}`);
    this.cpassword= await bcrypt.hash(this.cpassword,10);
    }
    next();
})


const Reggister= new mongoose.model("Register",wetschema);
module.exports= Reggister;