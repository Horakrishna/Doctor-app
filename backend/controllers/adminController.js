import bcrypt from 'bcrypt';
import { v2 as cloudinary } from 'cloudinary';
import jwt from 'jsonwebtoken';
import validator from 'validator';
import appiontmentModel from '../models/appiontment.js';
import doctorModel from '../models/doctorModel.js';
import userModel from '../models/userModel.js';
// Api for Adding Doctor
const  addDoctor =async(req,res)=>{

 try {
    // doctor data
    const {name,email,password,speciality,degree ,experience,about,fees,address} =req.body
    // image File Upload
    const imageFile =req.file

    // console.log({
    //   name,
    //   email,
    //   password,
    //   speciality,
    //   degree,
    //   experience,
    //   about,
    //   fees,
    //   address,
    // },imageFile);
    // checking for all data to add Doctor
    if ( !name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
        return res.json({
            success:false, 
            message:"Misssing Details"
        })
    }
    // Validating Email Format
    if (!validator.isEmail(email)) {
       return res.json({ 
        success: false,
        message: "Please Enter a valid Email address" }); 
    }
    // Check Password 
    if (password.length < 8 ) {
        return res.json({
          success: false,
          message: "Please Provide a Strong Password",
        });
    }

    // Encrypt password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)

    //upload Image to Cloudirnary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"})
// image Link
    const imageUrl = imageUpload.secure_url
// Save Doctor Data
     const doctorData = {
         name,
         email,
         password:hashedPassword,
         image:imageUrl,
         speciality,
         degree,
         experience,
         about,
         fees,
         address:JSON.parse(address),
         date:Date.now()
     };
     const newDoctor = new doctorModel(doctorData)
     await newDoctor.save()
      return res.json({
        success: true,
        message: "Doctor added successfully",
      });
 } catch (error) {
    console.log(error)
     res.json({
       success: false,
       message: error.message,
     });
 }
}
// Api for Admin
const loginAdmin = async (req,res)=>{
  try {
    const {email, password} = req.body
    if (email=== process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD ) {
      // create token
      const token = jwt.sign(email + password, process.env.JWT_SECRET);
      res.json({
        success:true, token
      })
    }else{
       res.json({
         success: false,
         message: "Invalid credentials",
       });
    }
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
}
// api for all doctor list from admin panel
const allDoctors =async (req,res)=>{

  try {
    // call doctor without password
    const doctors = await doctorModel.find({}).select('-password')
    res.json({
      success:true,
      doctors
    })
  } catch (error) {
     console.log(error);
     res.json({
       success: false,
       message: error.message,
     });
  }
}
// Api to get all appiontment list
const appiontmenstListAdmin =async (req,res)=>{
  try {
    const appiontments = await appiontmentModel.find({})
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
// APi for Appiontment Cansalation

const appiontmentCancelAdmin = async (req, res) => {
  try {
    const { appiontmentId } = req.body;
    const appiontmentData = await appiontmentModel.findById(appiontmentId);

    await appiontmentModel.findByIdAndUpdate(appiontmentId, {
      cancelled: true,
    });

    // Releasing Doctor Slot from DoctorModel
    const { docId, slotDate, slotTime } = appiontmentData;

    const doctorData = await doctorModel.findById(docId);

    let slots_booked = doctorData.slots_booked;

    slots_booked[slotDate] = slots_booked[slotDate].filter(
      (e) => e !== slotTime
    );

    await doctorModel.findByIdAndUpdate(docId, { slots_booked });
    res.json({
      success: true,
      message: "Appiontment Cancel",
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: error.message,
    });
  }
};
// Api to get Dashboard data
const adminDashboard = async(req,res)=>{
  try {
    // total number of users and Doctors
    const doctors =await doctorModel.find({})
    const users   =await userModel.find({})
    const appiontments =await appiontmentModel.find({})

    const dashData ={
      doctors:doctors.length,
      appiontments:appiontments.length,
      patients:users.length,
      latestAppiontments:appiontments.reverse().slice(0,5)
    }
    res.json({
      success:true,
      dashData
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
  addDoctor, adminDashboard, allDoctors,
  appiontmenstListAdmin,
  appiontmentCancelAdmin,
  loginAdmin
};

