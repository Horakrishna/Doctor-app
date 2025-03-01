import cors from "cors";
import "dotenv/config";
import express from 'express';
import connectCloudinary from './config/cloudinary.js';
import connectDB from './config/mongodb.js';
import adminRouter from './routes/adminRoute.js';
import doctotRouter from "./routes/DoctorRoute.js";
import userRouter from "./routes/userRoute.js";
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
// Doctor Route
app.use('/api/doctor',doctotRouter)
// User Route
app.use('/api/user',userRouter)

// Express App
app.listen(port,()=> console.log("Server Started", port))