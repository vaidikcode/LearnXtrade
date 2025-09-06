import mongoose from "mongoose";

const TeacherSchema = new mongoose.Schema({
    name:{type: String},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    profilePicture : {type: String, default: ''},
    
})


const Teacher = mongoose.model('teacher', TeacherSchema );

export default Teacher;
