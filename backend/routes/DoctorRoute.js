import express from 'express'
import { doctorList } from '../controllers/doctorController.js'

// Router instance
const doctotRouter = express.Router()

doctotRouter.get('/list' ,doctorList)

export default doctotRouter