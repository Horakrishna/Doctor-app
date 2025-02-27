import mongoose from "mongoose";


// Connect db
 const connectDB = async()=>{
    mongoose.connection.on('connected', ()=>console.log("Database Connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/doc-app`);
}
export default connectDB;















