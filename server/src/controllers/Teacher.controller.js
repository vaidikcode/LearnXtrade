import { asyncHandler } from "../utils/asyncHandler.js";
import Teacher from "../models/Teacher.model.js";
import bcrypt from 'bcrypt';
import { uploadOnCloudinary } from "../services/cloudinary.js";
import jwt from 'jsonwebtoken';
import Course from "../models/Course.model.js";


const registerTeacher = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email and password');
    }
    const existingUser = await Teacher.findOne({ email });

    if (existingUser) {
        res.status(409);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const profilePicture = req.file ? req.file.path : '';

    const cloudinaryResponse = await uploadOnCloudinary(profilePicture);

    if(!cloudinaryResponse){
        res.status(500);
        throw new Error('Error uploading profile picture');
    }
    
    const imageUrl = cloudinaryResponse.url;

    const token = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '1d' });

    const teacher = await Teacher.create({
        name,
        email,
        password: hashedPassword,
        profilePicture: imageUrl
    });

    if(!teacher){
        res.status(500);
        throw new Error('Error creating user');
    }
    
    res
    .status(201)
    .cookie('teacherToken', token, { httpOnly: true })
    .json({ message: 'Teacher registered successfully', teacher });
});

const  loginTeacher = asyncHandler(async (req, res) => {
    const { email, password } = req.body;   
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcrypt.compare(password, teacher.password);
    if (!isPasswordValid) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '1d' });
    res
    .status(200)
    .cookie('teacherToken', token, { httpOnly: true })
    .json({ message: 'Teacher logged in successfully' });
});

const addCourseContent = asyncHandler(async (req, res) => {
    const { name, contentTypes } = req.body;
    if (!name) {
        res.status(400);
        throw new Error('Please provide course name');
    }
    const teacher = req.teacher;

    const course = await Course.findOne({ name, creator: teacher._id });

    if (!course) {
        res.status(404);
        throw new Error('No courses found');
    }

    if (!req.files || req.files.length === 0) {
        res.status(400);
        throw new Error('Please upload content files');
    }
    if (!contentTypes || !Array.isArray(contentTypes) || contentTypes.length !== req.files.length) {
        res.status(400);
        throw new Error('Content types must be provided for each file');
    }

    const uploadPromises = req.files.map(file => uploadOnCloudinary(file.path));
    const uploadedFiles = await Promise.all(uploadPromises);

    const contentItems = uploadedFiles.map((file, index) => {
        if (!file) {
            throw new Error(`Failed to upload file ${index + 1}`);
        }
        return {
            type: contentTypes[index],
            url: file.secure_url || file.url
        };
    });

    console.log('Content Items:', contentItems);

    course.content.push(...contentItems);
    await course.save();

    res.status(200).json({ 
        message: 'Course content added successfully', 
        content: contentItems,
        course 
    });
});

const getMyCourses = asyncHandler(async (req, res) => {
    const teacher = req.teacher;

    const courses = await Course.find({ creator: teacher._id });

    res.status(200).json({ courses, message: 'Courses fetched successfully' });
});

export {registerTeacher, loginTeacher, addCourseContent, getMyCourses}
