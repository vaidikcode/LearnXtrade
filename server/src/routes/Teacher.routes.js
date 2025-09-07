import { Router } from "express";
import { registerTeacher, loginTeacher, addCourseContent , getMyCourses} from "../controllers/Teacher.controller.js";
import { upload } from '../middlewares/multer.middleware.js';
import { verifyTeacher } from '../middlewares/auth.middleware.js';

const router = Router();

router.route('/register').post(upload.single('profilePicture'), registerTeacher);
router.route('/login').post(loginTeacher);
router.route('/getMyCourses').get(verifyTeacher, getMyCourses);
router.route('/addContent').post(verifyTeacher, upload.array('contentFiles', 5), addCourseContent);


export default router;
