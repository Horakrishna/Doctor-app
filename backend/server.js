import cors from "cors";
import "dotenv/config";
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';
// App config
const app =express()
const port =process.env.PORT || 4000
connectDB()
connectCloudinary()
// middleware
app.use(express.json());
// Connect to frontend
app.use(cors())

// Api End Point
app.get('/',(req,res)=>{
 res.send('Api is Working great')
});
// Admin Route
app.use('/api/admin',adminRouter)

// Express App
app.listen(port,()=> console.log("Server Started", port))