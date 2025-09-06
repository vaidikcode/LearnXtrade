import { Router } from "express";
import { registerUser, loginUser, registerForCourse, getMyCourses } from "../controllers/Student.controller.js";
import {upload} from '../middlewares/multer.middleware.js';
import { verifyStudent } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/register').post(upload.single('profilePicture'), registerUser);
router.route('/login').post(loginUser);
router.route('/addCourse').post(verifyStudent, registerForCourse);
router.route('/getMyCourses').get(verifyStudent, getMyCourses);


export default router;
