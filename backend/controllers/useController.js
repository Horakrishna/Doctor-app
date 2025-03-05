import bcrypt from "bcrypt";
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import validator from "validator";
import appiontmentModel from "../models/appiontment.js";
import doctorModel from "../models/doctorModel.js";
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
// Api To get User Profile Data
const getProfile = async(req,res)=>{

  try {
   const { userId } = req.body
   const userData = await userModel.findById(userId).select('-password')

   res.json({success:true,userData})
  } catch (error) {
     console.log(error);
     res.json({
       success: false,
       message: error.message,
     });
  }
}
// Api to update USer Profile
const updateProfile =async(req,res)=>{
  try {
    const { userId, name, email, phone, dob, gender, address } = req.body;
    const imageFile = req.file;

    if (!name || !phone || !gender || !address) {
      return res.json({ success: false, message: "Data Missing" });
    }
    // Format the date to remove the time part
    const formattedDob = dob ? dob.split("T")[0] : null;
    await userModel.findByIdAndUpdate(userId, {
      name,
      phone,
      address: JSON.parse(address),
      dob: formattedDob,
      gender,
    });
    if (imageFile) {
      // Upload image to cloudinary
      const imageUpload = await cloudinary.uploader.upload(imageFile.path, {
        resource_type: "image",
      });
      const imageURL = imageUpload.secure_url;
      await userModel.findByIdAndUpdate(userId, { image: imageURL });
    }
    res.json({
      success: true,
      message: "Profile has been Updated",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
}
// Api for Booked Appiontment
const bookAppiontment = async(req,res)=>{

  try {
    const {userId, docId, slotDate, slotTime} = req.body
    const docData = await doctorModel.findById(docId).select('-password')

    if (!docData.available) {
      return res.json({
        success:false,
        message:"Doctor Not available"
      })
    }
    let slots_booked = docData.slots_booked

    // Checking for Slot availability
    if (slots_booked[slotDate]) {
      if (slots_booked[slotDate].includes(slotTime)) {
        return res.json({
          success: false,
          message: "Slot not Available",
        });
      } else {
        slots_booked[slotDate].push(slotTime);
      }
    } else {
      slots_booked[slotDate] = [];
      slots_booked[slotDate].push(slotTime)
    }
    // User data
    const userData = await userModel.findById(userId).select('-password')
  
    // Delet slot booked in doctor data
    delete docData.slots_booked
    const appionmentData ={
      userId,
      docId,
      userData,
      docData,
      amount:docData.fees,
      slotDate,
      slotTime,
      date:Date.now()

    }
    // Save data to database
    const newAppiontment = new appiontmentModel(appionmentData)
    await newAppiontment.save()


    // Save new Slotdata in Doctor Data
    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({
      success:true,
      message:"Appiontment Booked"
    })
  } catch (error) {
     console.log(error);
     res.json({
       success: false,
       message: error.message,
     });
  }
}
// Api to get user appiontment 
const userAppiontmentList = async(req,res)=>{

  try {
    const {userId } =req.body
    const appiontments = await appiontmentModel.find({userId})
    res.json({
      success:true,
      appiontments
    })
  } catch (error) {
      console.log(error);
      res.json({
        success: false,
        message: error.message,
      });
  }
}
// Api for Cancel AppiontMent
const cancelAppiontment =async(req,res)=>{
  try {
    const {userId,appiontmentId} =req.body
    const appiontmentData = await appiontmentModel.findById(appiontmentId)

    // verify Appiontment user 
    if (appiontmentData.userId !== userId) {
      return res.json({
        success:false,
        message:"Unauthorized action"
      })
    }
    await appiontmentModel.findByIdAndUpdate(appiontmentId, { cancelled : true});

    // Releasing Doctor Slot from DoctorModel
    const { docId,slotDate, slotTime  } =appiontmentData

    const doctorData =await doctorModel.findById(docId)

    let slots_booked =doctorData.slots_booked

    slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !==slotTime)

    await doctorModel.findByIdAndUpdate(docId,{slots_booked})
    res.json({
      success:true,
      message: "Appiontment Cancel"
    })
  } catch (error) {
     console.log(error);
     res.json({
       success: false,
       message: error.message,
     });
  }
}
export {
  bookAppiontment, cancelAppiontment, getProfile,
  loginUser,
  registerUser,
  updateProfile,
  userAppiontmentList
};

