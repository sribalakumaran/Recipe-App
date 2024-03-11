import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { userRouter } from './routes/users.js';
import { recipeRouter } from './routes/recipe.js';

const app=express();

app.use(express.json());
app.use(cors());

app.use("/auth",userRouter);
app.use("/recipes",recipeRouter);

mongoose.connect("mongodb+srv://bala:yyD2j0F0IGFLt6sI@cluster0.hb06law.mongodb.net/recipe?retryWrites=true&w=majority&appName=Cluster0").then(()=>{
    console.log("Connected to database");
});

app.listen(5000,()=>{
    console.log("Running on PORT 5000");
})