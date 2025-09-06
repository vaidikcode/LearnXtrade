import { asyncHandler } from "../utils/asyncHandler.js";
import Course from "../models/Course.model.js";
import { uploadOnCloudinary } from "../services/cloudinary.js";



const createCourse = asyncHandler(async (req, res) => {

    const { name, description, credits } = req.body;

    const teacher = req.teacher;

    if (!name || !description || !credits) {
        res.status(400);
        throw new Error('Please provide name, description and credits for the course');
    }

    if (!req.file) {
        res.status(400);
        throw new Error('Please provide a photo for the course');
    }

    const photo = req.file?.path;

    const pic = await uploadOnCloudinary(photo);

    if(!pic){
        res.status(500);
        throw new Error('Error uploading course photo');
    }

    const imageUrl = pic.url;

    const existingCourse = await Course.findOne({ name });

    if(existingCourse){
        res.status(409);
        throw new Error('Course with this name already exists');
    }

    const course = await Course.create({
        name,
        description,
        credits,
        photo: imageUrl,
        creator: teacher._id
    });

    if(!course){
        res.status(500);
        throw new Error('Error creating course');
    }

    res.status(201).json({ message: 'Course created successfully', course });
});


export { createCourse };
