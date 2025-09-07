import Student from "../models/Student.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


const studentAuth = asyncHandler(async (req,res,next)=>{

    const token = req.cookies?.studentToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        res.status(401);
        throw new Error("Unauthorized request");
    }

    const decodedUserInfo = jwt.verify(token , process.env.JWT_SECRET);

    const student =  await Student.findOne({ email: decodedUserInfo?.email }).select("-password ").populate('courses.courseId');

    if(!student){
        res.status(401);
        throw new Error("Invalid token");
    }



    return res.status(200).json({ student, message : "Student details fetched successfully" });
});

export {studentAuth}
