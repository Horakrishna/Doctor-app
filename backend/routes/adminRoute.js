import express from 'express';
import { addDoctor, adminDashboard, allDoctors, appiontmenstListAdmin, appiontmentCancelAdmin, loginAdmin } from '../controllers/adminController.js';
import { changeAvailability } from '../controllers/doctorController.js';
import authAdmin from '../middlewares/authAdmin.js';
import upload from '../middlewares/multer.js';

const adminRouter = express.Router()

adminRouter.post('/add-doctor',authAdmin, upload.single("image"),addDoctor)
adminRouter.post('/login', loginAdmin);
adminRouter.post('/all-doctors',authAdmin, allDoctors);
adminRouter.post('/change-availability',authAdmin, changeAvailability);
adminRouter.get('/appiontments',authAdmin, appiontmenstListAdmin);
adminRouter.post("/cancel-appiontments", authAdmin, appiontmentCancelAdmin);
adminRouter.get("/dashboard", authAdmin, adminDashboard);

export default adminRouter