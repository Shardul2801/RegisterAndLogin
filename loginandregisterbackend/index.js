import express from "express";
import cors from'cors';
import mongoose from "mongoose";


const app = express();
app.use(express.json())
app.use(express.urlencoded())
app.use(cors())
const corsOptions ={
    origin:'http://localhost:3000', 
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));

mongoose.connect('mongodb://localhost:27017/loginRegisterDb', {
    useNewUrlParser: true,
    useUnifiedTopology:true,
}, () => {
    console.log("DB connected")
});

//Schemas
//User Schema

const userSchema = new mongoose.Schema({
    name: String,
    email:String,
    password:String,
})

//Models

const User = new mongoose.model("User", userSchema)



//Routes
app.get("/", (req,res) => {
    res.send("My Api")
})

app.post("/login", (req,res) => {
    const{email, password} = req.body
    User.findOne({email:email}, (err,user)=>{
        if(user){
            if(password === user.password){
                res.send({message:"Sucessfully loggedIN",user:user})
            }
            else{
                res.send({message:"Password incorrect"})
            }
        }
        else{
            res.send({message:"User not registered"})
        }
    })
})

app.post("/register", (req,res) => {
    const{email, password} =  req.body;
    User.findOne({email:email}, (err, user) => {
        if(user){
            res.send({message: "User Already Exists"})
        }
        else{
            const user = new User({
                email:email,
                password:password,
            })
            user.save(err=> {
                if(err){
                    res.send(err)
                }else{
                   res.send( {message:"Sucessfully Registered , Now Login", user})
                }})
        }
    })
   

})

app.post("/homepage", (req,res) => {
    res.send("My Api")
})


app.listen(9002, ()=>{
    console.log("started at port 9002")
})