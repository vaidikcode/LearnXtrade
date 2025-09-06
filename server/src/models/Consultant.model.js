import mongoose from "mongoose";

const ConsultantSchema = new mongoose.Schema({
    name:{type: String},
    email:{type:String, required:true, unique:true},
    password:{type:String},
    profilePicture : {type: String, default: ''},
})


const Consultant = mongoose.model('consultant', ConsultantSchema );

export default Consultant;
