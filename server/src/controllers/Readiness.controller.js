import Student from '../models/Student.model.js';
import Course from '../models/Course.model.js';
import {asyncHandler} from '../utils/asyncHandler.js';

// Get student readiness index
const getStudentReadiness = asyncHandler(async (req, res) => {
    const studentId = req.user.id;

    try {
        // Get student data
        const student = await Student.findById(studentId).populate('courses.courseId');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Calculate metrics based on enrolled courses
        let totalVideos = 0;
        let videosWatched = 0;
        let totalNotes = 0;
        let notesCompleted = 0;
        let totalAssignments = 0;
        let assignmentsDone = 0;

        // Mock data calculation (you can replace this with actual progress tracking)
        student.courses.forEach(enrollment => {
            if (enrollment.courseId) {
                // Mock: assume each course has 10 videos, 5 notes, 3 assignments
                totalVideos += 10;
                totalNotes += 5;
                totalAssignments += 3;

                // Mock progress based on enrollment (you should replace with actual progress data)
                // For now, using random progress between 0.3 and 0.9
                const courseProgress = Math.random() * 0.6 + 0.3;
                videosWatched += Math.floor(10 * courseProgress);
                notesCompleted += Math.floor(5 * courseProgress);
                assignmentsDone += Math.floor(3 * courseProgress);
            }
        });

        // If no courses enrolled, provide default metrics
        if (student.courses.length === 0) {
            totalVideos = 10;
            totalNotes = 5;
            totalAssignments = 3;
            videosWatched = 2;
            notesCompleted = 1;
            assignmentsDone = 0;
        }

        const metrics = {
            VideosWatched: videosWatched,
            TotalVideos: totalVideos,
            NotesCompleted: notesCompleted,
            TotalNotes: totalNotes,
            AssignmentsDone: assignmentsDone,
            TotalAssignments: totalAssignments
        };

        // Call Go service to calculate readiness score
        const goServiceResponse = await fetch('http://localhost:8080/calculatescore', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(metrics)
        });

        if (!goServiceResponse.ok) {
            throw new Error('Failed to calculate readiness score');
        }

        const scoreData = await goServiceResponse.json();

        res.status(200).json({
            success: true,
            data: {
                metrics,
                readinessScore: scoreData.score,
                source: scoreData.source,
                enrolledCourses: student.courses.length,
                completionPercentage: Math.round(scoreData.score * 100)
            }
        });

    } catch (error) {
        console.error('Error calculating readiness:', error);
        res.status(500).json({
            success: false,
            message: "Failed to calculate readiness index"
        });
    }
});

// Get detailed metrics breakdown
const getDetailedMetrics = asyncHandler(async (req, res) => {
    const studentId = req.user.id;

    try {
        const student = await Student.findById(studentId).populate('courses.courseId');
        
        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        // Calculate detailed metrics per course
        const courseMetrics = student.courses.map(enrollment => {
            const course = enrollment.courseId;
            // Mock progress data (replace with actual tracking)
            const progress = Math.random() * 0.6 + 0.3;
            
            return {
                courseId: course._id,
                courseName: course.title || course.name,
                videosWatched: Math.floor(10 * progress),
                totalVideos: 10,
                notesCompleted: Math.floor(5 * progress),
                totalNotes: 5,
                assignmentsDone: Math.floor(3 * progress),
                totalAssignments: 3,
                overallProgress: Math.round(progress * 100),
                grade: enrollment.grade
            };
        });

        res.status(200).json({
            success: true,
            data: {
                totalCourses: student.courses.length,
                courseMetrics,
                totalCredits: student.credits || 0
            }
        });

    } catch (error) {
        console.error('Error fetching detailed metrics:', error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch detailed metrics"
        });
    }
});

export {
    getStudentReadiness,
    getDetailedMetrics
};
