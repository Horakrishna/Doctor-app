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
export { changeAvailability, doctorList };

