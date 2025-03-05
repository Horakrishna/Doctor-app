import express from 'express';
import {
    appiontmentsDoctor,
    appointmentCancel,
    appointmentComplete,
    doctorDashBoard,
    doctorList,
    doctorLogin,
    doctorProfile,
    updateDoctorProfile,
} from "../controllers/doctorController.js";
import authDoctor from '../middlewares/authDoctor.js';

// Router instance
const doctotRouter = express.Router()

doctotRouter.get('/list' ,doctorList)
doctotRouter.post("/login", doctorLogin);
doctotRouter.get("/appiontments", authDoctor, appiontmentsDoctor);
doctotRouter.post("/complete-appiontments", authDoctor, appointmentComplete);
doctotRouter.post("/cancel-appiontments", authDoctor, appointmentCancel);
doctotRouter.get("/dashboard", authDoctor, doctorDashBoard);
doctotRouter.get("/profile", authDoctor, doctorProfile);
doctotRouter.post("/update-profile", authDoctor, updateDoctorProfile);


export default doctotRouter