require('dotenv').config();
const express = require('express');
const app = express();
const path= require('path');
var bcrypt = require('bcryptjs');
const validator= require("validator");
const { body } = require('express-validator');
const port = process.env.PORT;
const hbs= require("hbs");
var cookieParser = require('cookie-parser');
const auth= require("./middleware/auth");

app.use(cookieParser());

require('./db/conn');
const Reggister= require("./models/schema")


const staticPath= path.join(__dirname,"../public");
const viewsPath= path.join(__dirname,"../template/views");
const partialsPath= path.join(__dirname,"../template/partials");

app.use(express.static(staticPath));
app.set('view engine', 'hbs');
app.set('views',viewsPath);
hbs.registerPartials(partialsPath);
app.use(express.json());
app.use(express.urlencoded({extended: false}));

console.log(process.env.SECRET_KEY);

app.get("/",(req,res)=>{
    res.render("index");
})
app.get("/recipes",(req,res)=>{
    res.render("recipes");
})
app.get("/detail",(req,res)=>{
    res.render("detail");
})
app.get("/404",(req,res)=>{
    res.render("404error");
})
app.get("/saved-recipe",auth, (req,res)=>{
    console.log(`req h bhai${req.cookies.jwt}`);
    res.render("saved-recipe");
})
app.get("/logout",auth, async(req,res)=>{
    try{
        //req.user.tokeni= [];
        /*res.clearCookie("jwt");
        console.log("logout successfully")
        await req.user.save()
        res.render("index");*/
        req.user.tokens= [];
        res.clearCookie("jwt");
        console.log("logout successfully")
        await req.user.save()
        res.render("index")
    }
    catch(e){
        res.status(500).send(e);
    }
})


app.post("/register",async (req,res)=>{
    try{
        const password= req.body.password;
        const cpassword= req.body.cpassword;
        if(password=== cpassword){
            const insert= new Reggister({
                firstname: req.body.firstname,
                email: req.body.email,
                password: req.body.password,
                cpassword: req.body.cpassword,
                
            }) 
            
          //////////add middleware function which i had defined in schems
            const token= await insert.generateAuthToken();
            console.log("created token  "+ token);
            res.cookie("jwt",token,{
                expires:new Date(Date.now()+ 30000),
                httpOnly:true
            }) 

            const registerd= await insert.save();
            console.log(registerd);
            res.render("index");   

        }
        else{
            res.send("wrong passwords");
        }
    }catch(e){
        res.send(e);
    }
})

app.post("/login",async(req,res)=>{
    try{
        const email= req.body.email;
        const pass= req.body.password;
        if (!email || !pass) {
            return res.status(400).json({ message: "Please enter email & password"})
        }
        const data= await Reggister.findOne({email:email});
        
        const match= await bcrypt.compare(pass,data.password);
        ///// token generate
        const token= await data.generateAuthToken();
        console.log("created token"+ token);
        
        res.cookie("jwt",token,{
            expires: new Date(Date.now()+ 120000),
            httpOnly:true
        })
        ////////// yha console mei read nhi ker sakta
       // console.log(req.cookies.jwt);

        if(match){
            res.render("index");
        }
        else{
            res.send("wrong password");
        }
    }
    catch(e){
        res.send(e);
    }
})

app.get("*",(req,res)=>{
    res.render("404error",{
        content:"Oops page not fount",
    })
})


app.listen(port,()=>{
    console.log("server is running");
})