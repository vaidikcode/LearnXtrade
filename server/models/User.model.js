import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type: String},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    type : {type : String, default : 'student', enum: ['student', 'teacher', 'consultant']},
    grades : {type: String},
    credits : {type: Number, default: 0},
    profilePicture : {type: String, default: ''},
    
})


const User=mongoose.models.user || mongoose.model('user', userSchema);

export default User;
