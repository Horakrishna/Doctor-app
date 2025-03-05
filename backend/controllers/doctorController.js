import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import appiontmentModel from "../models/appiontment.js";
import doctorModel from "../models/doctorModel.js";
// Change Doctor Availability
const changeAvailability = async (req,res)=>{

     try {
        
        // Doctor Id
        const { docId } =req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId, { available : !docData.available });
        res.json({
            success:true,
            message:"Availability Change"
        })
     } catch (error) {
        console.log(error)
        res.json({
          success: false,
          message: error.message,
        });
     }
}
// Api From doctor List 
const doctorList =async(req,res)=>{

   try {
      const doctors = await doctorModel.find({}).select(['-email','-password'])
      res.json({
         success:true,
         doctors
      })
   } catch (error) {
      console.log(error)
      res.json({
        success: false,
        message: error.message,
      });
   }
}
// Api For Doctor Login
const doctorLogin=async(req,res)=>{
   try {
    const { email,password} =req.body  
    const doctor  = await doctorModel.findOne({email})
   //  check doctor Email
   if (!doctor) {
      return res.json({
         success:false,
         message:"Doctor Doesnot Exist"
      })
   }
   const isMatch = await bcrypt.compare(password,doctor.password)
   if (isMatch) {
      const token = jwt.sign({ id: doctor._id }, process.env.JWT_SECRET);
      res.json({
         success:true,
         token
      })
   }else{
      res.json({
        success: false,
        message: "Doctor Doesnot Exist",
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
// Api For doctor Appiontment for Doctor Dashboard
const appiontmentsDoctor = async(req,res)=>{
   try {   
     const { docId } = req.body 
     const appointments = await appiontmentModel.find({ docId });
     res.json({
       success: true,
       appointments,
     });
   } catch (error) {
       console.log(error);
       res.json({
         success: false,
         message: error.message,
       });
   }
}
// API for mark Appointment complete
const appointmentComplete = async(req,res)=>{
   try {

      const { docId, appointmentId } =req.body

      const appointmentData = await appiontmentModel.findById(appointmentId)
      if (appointmentData && appointmentData.docId === docId) {

         await appiontmentModel.findByIdAndUpdate(appointmentId, {
           isCompleted:true
         });
         return res.json({
            success:true,
            message: "Appointment Completed"
         })
      }else{
          return res.json({
            success: false,
            message: "Marked Failed",
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
// API for Cancel Appointment Doctor Panel
const appointmentCancel = async(req,res)=>{
   try {
      const {docId,appointmentId} =req.body

      const appointmentData = await appiontmentModel.findById(appointmentId)

      if (appointmentData && appointmentData.docId === docId) {
         await appiontmentModel.findByIdAndUpdate(appointmentId, {
           cancelled: true,
         });
         return res.json({
            success:true,
            message: "Appointment cancel"
         })
      }else{
          return res.json({
            success: false,
            message: "Cancelation Failed",
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
// Api For Doctor Dashboard Data doctor pannel
const doctorDashBoard =async(req,res)=>{
   try {
      const { docId }= req.body
      const appointments =await appiontmentModel.find({docId})
      // Total Earning of Doctor
      let earnings =0
      appointments.map((item)=>{
         if (item.isCompleted || item.payment) {
            earnings += item.amount
         }
      })
      // Number of Patient
      let patients =[]
      appointments.map((item)=>{
         if (!patients.includes(item.userId)) {
            patients.push(item.userId)
         }
      })

      // Dashboard Data
      const dashData = {
        earnings,
        appointments: appointments.length,
        patients: patients.length,
        latestAppointments: appointments.reverse().slice(0,5)
      };
      res.json({
         success:true,dashData
      })
   } catch (error) {
       console.log(error);
       res.json({
         success: false,
         message: error.message,
       });
   }
}
// Api for Doctor profile for Doctor Profile
const doctorProfile = async(req,res)=>{
 try {
   const { docId } = req.body
   const profileData = await doctorModel.findById(docId).select('-password')
   res.json({
      success:true,profileData
   })
 } catch (error) {
   console.log(error);
   res.json({
     success: false,
     message: error.message,
   });
 }
}
// Api For Doctor updated Data for Doctor Dashboard
const updateDoctorProfile= async(req,res)=>{
   try {
      const { docId, fees,address, available} = req.body
      await doctorModel.findByIdAndUpdate(docId, {fees,address,available})
      res.json({
         success:true,
         message:"Profile Updated"
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
   appiontmentsDoctor,
   appointmentCancel,
   appointmentComplete,
   changeAvailability,
   doctorDashBoard,
   doctorList,
   doctorLogin, doctorProfile, updateDoctorProfile
};

