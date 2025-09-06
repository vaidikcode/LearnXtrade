import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import http from 'http'
import cookieParser from 'cookie-parser';
import connectDB from './src/db/db.js'

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
    origin: process.env.ALLOWED_ORIGIN || 'http://localhost:5173',
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.use(cookieParser());


import StudentRoutes from './src/routes/Student.routes.js'
import TeacherRoutes from './src/routes/Teacher.routes.js'
import CourseRoutes from './src/routes/Course.routes.js'

app.use('/api/student', StudentRoutes);
app.use('/api/teacher', TeacherRoutes);
app.use('/api/course', CourseRoutes);




connectDB()
.then(() => {
    const server = app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });

    server.on("error", (err) => {
        console.log("Server error:", err);
    });
})
.catch((err) => {
    console.log(`DB connection error: ${err}`);
    process.exit(1);
});

