import Teacher from "../models/Teacher.model.js";
import {asyncHandler} from "../utils/asyncHandler.js";
import jwt from 'jsonwebtoken'


 const teacherAuth = asyncHandler(async (req,res,next)=>{

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
    return res.status(200).json({ teacher, message : "Teacher details fetched successfully" });
});

export {teacherAuth}
