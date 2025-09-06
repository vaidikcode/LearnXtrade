import Student from '../models/Student.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';
import bcyrpt from 'bcrypt';
import {uploadOnCloudinary} from '../services/cloudinary.js';
import jwt from 'jsonwebtoken';
import Course from '../models/Course.model.js';

const registerUser = asyncHandler(async (req, res) => {

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        res.status(400);
        throw new Error('Please provide name, email and password');
    }
    const existingUser = await Student.findOne({ email });

    if (existingUser) {
        res.status(409);
        throw new Error('User already exists');
    }

    const hashedPassword = await bcyrpt.hash(password, 10);

    const profilePicture = req.file ? req.file.path : '';

    const cloudinaryResponse = await uploadOnCloudinary(profilePicture);

    if(!cloudinaryResponse){
        res.status(500);
        throw new Error('Error uploading profile picture');
    }
    
    const imageUrl = cloudinaryResponse.url;

    const token = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '1d' });

    const student = await Student.create({
        name,
        email,
        password: hashedPassword,
        profilePicture: imageUrl
    });

    if(!student){
        res.status(500);
        throw new Error('Error creating user');
    }
    
    res
    .status(201)
    .cookie('studentToken', token, { httpOnly: true })
    .json({ message: 'User registered successfully', student });
});

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;   
    if (!email || !password) {
        res.status(400);
        throw new Error('Please provide email and password');
    }
    const student = await Student.findOne({ email });
    if (!student) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    const isPasswordValid = await bcyrpt.compare(password, student.password);
    if (!isPasswordValid) {
        res.status(401);
        throw new Error('Invalid email or password');
    }
    const token = jwt.sign({ email}, process.env.JWT_SECRET, { expiresIn: '1d' });
    res
    .status(200)
    .cookie('studentToken', token, { httpOnly: true })
    .json({ message: 'Student logged in successfully' });
});

const getProfile = asyncHandler(async (req, res) => {
    const student = await Student.findById(req.student.id).select('-password');
    if (!student) {
        res.status(404);
        throw new Error('Student not found');
    }
    res.status(200).json({ student });
});

const registerForCourse = asyncHandler(async (req, res) => {

    const { courseId } = req.body;

    const student = req.student;

    if (!courseId) {
        res.status(400);
        throw new Error('Please provide courseId');
    }

    const course = await Course.findById(courseId);

    if (!course) {
        res.status(404);
        throw new Error('Course not found');
    }

    const isAlreadyRegistered = student.courses.find(
        (course) => course.courseId.toString() === courseId
    );

    if (isAlreadyRegistered) {
        res.status(409);
        throw new Error('You are already registered for this course');
    }

    student.courses.push({ courseId });
    await student.save({ validateBeforeSave: false });

    res.status(201).json({ message: 'Registered for course successfully' });
});

const getMyCourses = asyncHandler(async (req, res) => {

    const student = req.student;

    const courses = await Student.findById(student._id).populate('courses.courseId');

    if (!courses) {
        res.status(404);
        throw new Error('No courses found');
    }
    res.status(200).json({ courses: courses.courses }).message('Courses fetched successfully');
});




export { registerUser, loginUser, getProfile, getMyCourses, registerForCourse };
