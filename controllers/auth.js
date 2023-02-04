import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import users from '../models/auth.js'


export const signup=async(req,res)=>{
     const{name,email,password}=req.body;
    try{
        const existingUser= await users.findOne({email})
        if(existingUser){
            return res.status(400).json({message:"user already exist!"});
        }
       const hashedPassword= await bcrypt.hash(password,12);
       const newUser=await users.create({name,email,password:hashedPassword});
       const token=jwt.sign({email:newUser.email,id:newUser._id},process.env.JWT_SECRET,{expiresIn:'1h'});
       res.status(200).json({result:newUser,token})


        
    }catch(err){
        res.status(500).send("Something went wrong...")
    }

}


export const login=async(req,res)=>{
    const{email,password}=req.body;
    try{
        const existingUser=await users.findOne({email});
        if(!existingUser){
            return res.status(400).send({message:"User doesn't exist"})
        }
        const isPasswordCrt=await bcrypt.compare(password,existingUser.password)    
        if(!isPasswordCrt){
            return res.status(400).json({message:"Invalid Credentials!"})
        }
        const token=jwt.sign({email:existingUser.email,id:existingUser._id},"test",{expiresIn:'1h'});
        res.status(200).json({result:existingUser,token})
    }catch(err){
        res.status(500).send("Something went wrong...")
    }

}