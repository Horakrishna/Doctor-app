import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import validator from "validator";
import userModel from "../models/userModel.js";
// Api For Register user

const registerUser = async(req,res)=>{

    try {
      const { name, email, password } = req.body;

      if (!name || !password || !email) {
        return res.json({
          success: false,
          message: "Missing Details",
        });
      }
      // Validate Email
      if (!validator.isEmail(email)) {
        return res.json({
          success: false,
          message: "Provide valid Email",
        });
      }
      // Validate Password
      if (password.length < 8) {
        return res.json({
          success: false,
          message: "Enter a Strong password",
        });
      }
    //   Hashing Password 
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    const userData = {
      name,
      email,
      password: hashedPassword,
    };
    // save userData to database
    const newUser = new userModel(userData)
    const user =await newUser.save()
    // Create token
    const token =jwt.sign({id:user._id},process.env.JWT_SECRET)
    res.json({
        success:true,
        token
    })
    } catch (error) {
         console.log(error);
         res.json({
           success: false,
           message: error.message,
         });
    }
}
// Api for User Login
const loginUser =async(req,res) =>{

    try {
        const { email, password} =req.body
        const user = await userModel.findOne({email})
        if (!user) {
          return res.json({
             success: false,
             message:'user doesnot exist',
           }); 
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (isMatch) {
            const token = jwt.sign({id:user._id}, process.env.JWT_SECRET)
            res.json({
                success:true,token
            })
        }else{
            res.json({
                success:false,
                message:"Invalid User"
            })
        }

    } catch (error) {
        console.log(error);
        res.json({
          success: false,
          message: error.message,
        }); 
    }
}
export { loginUser, registerUser };

