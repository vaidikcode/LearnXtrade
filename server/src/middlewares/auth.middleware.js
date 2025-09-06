import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'
import Student from "../models/Student.model.js";
import Teacher from "../models/Teacher.model.js";
import Consultant from "../models/Consultant.model.js";


 const verifyStudent = asyncHandler(async (req,res,next)=>{

    const token = req.cookies?.studentToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        res.status(401);
        throw new Error("Unauthorized request");
    }

    const decodedUserInfo = jwt.verify(token , process.env.JWT_SECRET);

    const student =  await Student.findOne({ email: decodedUserInfo?.email }).select("-password ");

    if(!student){
        res.status(401);
        throw new Error("Invalid access token");
    }

    req.student = student;
    next();
});

 const verifyTeacher = asyncHandler(async (req,res,next)=>{

    const token = req.cookies?.teacherToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        res.status(401);
        throw new Error("Unauthorized request");
    }

    const decodedUserInfo = jwt.verify(token , process.env.JWT_SECRET);

    const teacher =  await Teacher.findOne({ email: decodedUserInfo?.email }).select("-password ");

    if(!teacher){
        res.status(401);
        throw new Error("Invalid access token");
    }

    req.teacher = teacher;
    next();
});

 const verifyConsultant = asyncHandler(async (req,res,next)=>{

    const token = req.cookies?.consultantToken || req.header("Authorization")?.replace("Bearer ","");

    if(!token){
        res.status(401);
        throw new Error("Unauthorized request");
    }

    const decodedUserInfo = jwt.verify(token , process.env.JWT_SECRET);

    const consultant =  await Consultant.findById(decodedUserInfo?._id).select("-password ");

    if(!consultant){
        res.status(401);
        throw new Error("Invalid access token");
    }

    req.consultant = consultant;
    next();
});

export { verifyStudent, verifyTeacher, verifyConsultant }
