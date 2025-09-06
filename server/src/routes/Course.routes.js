import { Router } from "express";
import { createCourse } from "../controllers/Courses.controller.js";
import {upload} from '../middlewares/multer.middleware.js';
import { verifyTeacher } from "../middlewares/auth.middleware.js";

const router = Router();

router.route('/create').post(upload.single('picture'), verifyTeacher, createCourse);

export default router;
