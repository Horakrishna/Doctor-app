import express from 'express'
import { bookAppiontment, cancelAppiontment, getProfile, loginUser, registerUser, updateProfile, userAppiontmentList } from '../controllers/useController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile',authUser, getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser, updateProfile)
userRouter.post('/book-appiontment',authUser, bookAppiontment)
userRouter.get("/appointment", authUser, userAppiontmentList);
userRouter.post("/cancel-appointment", authUser, cancelAppiontment);

export default userRouter 