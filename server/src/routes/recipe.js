import { RecipeModel } from "../models/Recipes.js";
import express from "express";
import mongoose from "mongoose";
import { UserModel } from "../models/User.js";
import { verifyToken } from "./users.js";
const recipeRouter=express.Router();

recipeRouter.get("/",async(req,res)=>{
    try{
        const response=await RecipeModel.find({});
        res.json(response);
    }
    catch(err){
        console.log(err);
    }
});

recipeRouter.post("/",async(req,res)=>{
    const recipe= new RecipeModel(req.body);
    try{
        await recipe.save();
        res.json(recipe);
    }
    catch(err){
        console.log(err);
    }
});

recipeRouter.put("/",async(req,res)=>{
    try{
        const recipe= await RecipeModel.findById(req.body.recipeID);
        const user=await UserModel.findById(req.body.userID);
        user.savedRecipes.push(recipe);
        user.save();
        res.json({savedRecipes:user.savedRecipes});
    }
    catch(err){
        console.log(err);
    }
});

recipeRouter.get("/savedRecipes/ids/:userID",async(req,res)=>{
    try {
        const user=await UserModel.findById(req.params.userID);
        res.json({savedRecipes:user?.savedRecipes});
    } catch (err) {
        console.log(err);
    }
})

recipeRouter.get("/savedRecipes/:userID",async(req,res)=>{
    try {
        const user=await UserModel.findById(req.params.userID);
        const savedRecipes = await RecipeModel.find({
            _id:{$in:user.savedRecipes}
        })
        res.json({savedRecipes});
    } catch (err) {
        console.log(err);
    }
})

export {recipeRouter};