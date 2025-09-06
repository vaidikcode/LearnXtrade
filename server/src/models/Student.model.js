import mongoose from "mongoose";

const StudentSchema = new mongoose.Schema({
    name:{type: String},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    profilePicture : {type: String, default: ''},
    courses : [{
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'course' },
            grade: { type: Number} 
    }],
    credits : {
        type: Number,
        default: 0
    }
    
});


const Student = mongoose.model('student', StudentSchema );

export default Student;
