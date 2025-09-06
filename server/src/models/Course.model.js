import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({

  name : {
    type : String,
    required : true,
    unique : true
  },
  description : {
    type : String,
    required : true
  },
  creator : {
    type : mongoose.Schema.Types.ObjectId,
    ref : 'User',
    required : true
  },
  photo : {
    type : String,
    required : true
  },
  isCompleted : {
    type : Boolean,
    default : false
  },
  credits : {
    type : Number,
    required : true,
    default : 0
  },
  content : [{
    type : { type : String },
    url : { type : String }
  }]

},{ timestamps: true }
);

const Course = mongoose.model('course', courseSchema );

export default Course;
