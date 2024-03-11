import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import {UserModel} from './../models/User.js';

const userRouter=express.Router();

userRouter.post("/register",async(req,res)=>{
    try {
        const {username, password}=req.body;
        const user=await UserModel.findOne({username});
        
        if (user) {
            // If user found, return user data
            return res.json({message:"User already exists!"});
        }

        const hashedPassword=await bcrypt.hash(password,10);

        const newUser=new UserModel({username:username,password:hashedPassword});
        //await newUser.save();
        await UserModel.create(newUser);
        res.json({message:"Added to the database"})
    } catch (error) {
        console.log(error);
    }
});

userRouter.post("/login",async(req,res)=>{
    try{
        const {username,password}=req.body;
        const user=await UserModel.findOne({username});
        if(!user){
            return res.json({message:"User does not exists create new user"});
        }
        else{
            const ispassword=await bcrypt.compare(password,user.password);
            if(ispassword){
                const token=jwt.sign({id:user._id},"secret");
                res.json({token,userID:user._id});
            }
            else{
                return res.json({message:"Invalid Username or Password"});
            }
        }
    }
    catch(err){
        console.log(err);
    }
});

export {userRouter};

export const verifyToken=(req,res,next)=>{
    const token=req.headers.authorization;
    if(token){
        jwt.verify(token,"secret",(err)=>{
            if (err) return res.sendStatus(403);
            next();
        })
    }
    else{
        res.sendStatus(401);
    }
}
