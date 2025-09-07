import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from "framer-motion";

export default function TeacherDashboard() {
    const navigate = useNavigate();
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('courses');
    const [showAddModal, setShowAddModal] = useState(false);
    
    const [teacher, setTeacher] = useState({
        name: "",
        role: "teacher",
        email: "",
        profilePicture: "",
        expertise: "Financial Trading",
        ratings: 0,
        students: 0,
        earnings: 0,
        courses: [],
        recentActivities: [
            { id: 1, type: "course_update", message: "You updated your course", time: "2 hours ago" },
            { id: 2, type: "new_student", message: "New student enrolled in your course", time: "1 day ago" },
            { id: 3, type: "student_review", message: "New review on your course", time: "3 days ago" }
        ]
    });

    // API call to get teacher data
    useEffect(() => {
        const fetchTeacherData = async () => {
            try {
                setIsLoading(true);
                
                // Check authentication status
                const teacherAuthResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/teachAuth`, {
                    withCredentials: true
                });
                
                if (teacherAuthResponse.data.teacher) {
                    const teacherData = teacherAuthResponse.data.teacher;
                    
                    // Get courses created by this teacher
                    const coursesResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/teacher/getMyCourses`, {
                        withCredentials: true
                    });
                    
                    // Format courses data
                    const mappedCourses = coursesResponse.data.courses.map(course => ({
                        id: course._id,
                        title: course.name,
                        status: course.isCompleted ? "published" : "draft",
                        students: course.students?.length || 0,
                        rating: course.rating || 0,
                        lastUpdated: new Date(course.updatedAt).toISOString().split('T')[0],
                        image: course.photo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                        description: course.description,
                        credits: course.credits
                    }));
                    
                    // Update teacher state with data from API
                    setTeacher(prevTeacher => ({
                        ...prevTeacher,
                        name: teacherData.name || "Teacher",
                        email: teacherData.email || "",
                        profilePicture: teacherData.profilePicture || "",
                        courses: mappedCourses,
                        // Calculate some statistics
                        students: mappedCourses.reduce((total, course) => total + course.students, 0),
                        earnings: mappedCourses.reduce((total, course) => total + (course.credits * course.students), 0)
                    }));
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error("Authentication error:", error);
                navigate('/login');
                setIsLoading(false);
            }
        };
        
        fetchTeacherData();
    }, [navigate]);
    
    const handleEditCourse = (courseId) => {
        console.log(`Edit course ${courseId}`);
        // Navigate to course edit page
        navigate(`/course/edit/${courseId}`);
    };
    
    const handleAddContent = (courseId) => {
        console.log(`Add content to course ${courseId}`);
        // Show modal or navigate to content addition page
        navigate(`/course/content/${courseId}`);
    };
    
    const handleCreateCourse = async (e) => {
        e.preventDefault();
        
        try {
            // Get form data
            const courseTitle = document.getElementById('course-title').value;
            const courseDescription = document.getElementById('course-description').value;
            const courseCategory = document.getElementById('course-category').value;
            const difficulty = document.querySelector('input[name="difficulty"]:checked').value;
            
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('name', courseTitle);
            formData.append('description', courseDescription + `\n\nCategory: ${courseCategory}\nDifficulty: ${difficulty}`);
            formData.append('credits', 350); // Default credits value
            
            // Add a placeholder image if no file is selected
            // In a real app, you'd have a file input for the course image
            const defaultImage = 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60';
            formData.append('picture', defaultImage);
            
            // Create course via API
            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/course/create`, 
                formData, 
                { 
                    withCredentials: true,
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
            );
            
            if (response.data && response.data.course) {
                // Add new course to state
                const newCourse = {
                    id: response.data.course._id,
                    title: response.data.course.name,
                    status: "draft",
                    students: 0,
                    rating: 0,
                    lastUpdated: new Date().toISOString().split('T')[0],
                    image: response.data.course.photo || defaultImage,
                    description: response.data.course.description,
                    credits: response.data.course.credits
                };
                
                setTeacher(prevTeacher => ({
                    ...prevTeacher,
                    courses: [...prevTeacher.courses, newCourse]
                }));
                
                alert("Course created successfully!");
            }
        } catch (error) {
            console.error("Error creating course:", error);
            alert("Failed to create course. Please try again.");
        }
        
        setShowAddModal(false);
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] bg-pattern">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-10 border-b border-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <Link to="/" className="inline-block">
                                <span className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                                    LearnXtrade
                                </span>
                            </Link>
                        </div>

                        <div className="flex items-center space-x-4">
                            <button className="p-1.5 rounded-full text-[#6B7280] hover:text-[#6C63FF] hover:bg-indigo-50 transition-all duration-200">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                            </button>

                            <div className="relative">
                                <button
                                    onClick={() => setIsMenuOpen(!isMenuOpen)}
                                    className="flex items-center space-x-2 focus:outline-none"
                                >
                                    {teacher.profilePicture ? (
                                        <div className="h-9 w-9 rounded-full overflow-hidden shadow-md border-2 border-white">
                                            <img 
                                                src={teacher.profilePicture} 
                                                alt={teacher.name}
                                                className="h-full w-full object-cover" 
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-md">
                                            {teacher.name ? teacher.name.charAt(0) : "T"}
                                        </div>
                                    )}
                                    <span className="hidden md:block text-sm font-medium text-[#111827]">{teacher.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 ring-1 ring-[#6C63FF]/10">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Your Profile</Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Settings</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <button 
                                            onClick={async () => {
                                                try {
                                                    await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/teacher/logout`, {}, { withCredentials: true });
                                                    navigate('/login');
                                                } catch (error) {
                                                    console.error("Error during logout:", error);
                                                    navigate('/login');
                                                }
                                            }}
                                            className="block w-full text-left px-4 py-2 text-sm text-[#111827] hover:bg-red-50 hover:text-[#EF4444]"
                                        >
                                            Sign out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Teacher Welcome Banner */}
                <div className="transition-all duration-500 ease-out mb-8">
                    <div className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold">Welcome back, {teacher.name}!</h2>
                                <div className="ml-4 px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                                    Teacher Account
                                </div>
                            </div>
                            <p className="mt-1 text-indigo-100 text-sm">
                                {teacher.email}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                    <span className="font-medium">{teacher.courses.length}</span> Courses Created
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                    <span className="font-medium">{teacher.students}</span> Total Students
                                </div>
                                <button 
                                    className="ml-auto bg-white text-[#6C63FF] px-5 py-2 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm flex items-center"
                                    onClick={() => setShowAddModal(true)}
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                    Create New Course
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Top Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {/* Earnings Card */}
                            <div className="transition-all duration-500 ease-out">
                                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00C49A]/5 rounded-full"></div>
                                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#00C49A]/5 rounded-full"></div>

                                    <div className="relative">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-[#00C49A] to-teal-500 text-white p-3 rounded-xl shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-2xl font-bold text-[#111827]">${teacher.earnings}</div>
                                            <p className="text-[#6B7280] text-sm">Total Earnings</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Students Card */}
                            <div className="transition-all duration-500 ease-out">
                                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#6C63FF]/5 rounded-full"></div>
                                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#6C63FF]/5 rounded-full"></div>

                                    <div className="relative">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-[#6C63FF] to-indigo-500 text-white p-3 rounded-xl shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-2xl font-bold text-[#111827]">{teacher.students}</div>
                                            <p className="text-[#6B7280] text-sm">Total Students</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Rating Card */}
                            <div className="transition-all duration-500 ease-out">
                                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#F59E0B]/5 rounded-full"></div>
                                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#F59E0B]/5 rounded-full"></div>

                                    <div className="relative">
                                        <div className="flex-shrink-0 bg-gradient-to-br from-[#F59E0B] to-amber-500 text-white p-3 rounded-xl shadow-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                                            </svg>
                                        </div>

                                        <div className="mt-4">
                                            <div className="text-2xl font-bold text-[#111827]">{teacher.ratings}</div>
                                            <p className="text-[#6B7280] text-sm">Average Rating</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Teacher Courses Section */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                                <div className="border-b border-gray-100">
                                    <div className="flex">
                                        <button
                                            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === 'courses'
                                                ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                                : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                                } transition-colors duration-200`}
                                            onClick={() => setActiveTab('courses')}
                                        >
                                            My Courses
                                        </button>
                                        <button
                                            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === 'drafts'
                                                ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                                : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                                } transition-colors duration-200`}
                                            onClick={() => setActiveTab('drafts')}
                                        >
                                            Draft Courses
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {isLoading ? (
                                        <div className="flex justify-center p-8">
                                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#6C63FF]"></div>
                                        </div>
                                    ) : (
                                        <div className="space-y-5">
                                            {teacher.courses
                                                .filter(course => activeTab === 'drafts' ? course.status === 'draft' : course.status === 'published')
                                                .map(course => (
                                                    <div key={course.id} className="flex flex-col md:flex-row border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                                                        <div className="md:w-48 h-32 md:h-auto relative overflow-hidden">
                                                            <img
                                                                src={course.image}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                        </div>
                                                        <div className="p-5 flex-1 flex flex-col">
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-lg font-semibold text-[#111827] group-hover:text-[#6C63FF] transition-colors duration-200">
                                                                    {course.title}
                                                                </h4>
                                                                {course.status === 'published' ? (
                                                                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                                                        Published
                                                                    </span>
                                                                ) : (
                                                                    <span className="px-2 py-1 bg-amber-100 text-amber-800 text-xs rounded-full font-medium">
                                                                        Draft
                                                                    </span>
                                                                )}
                                                            </div>
                                                            
                                                            <div className="flex items-center mt-2 text-sm text-[#6B7280]">
                                                                <span>Last updated: {course.lastUpdated}</span>
                                                                {course.status === 'published' && (
                                                                    <>
                                                                        <span className="mx-2">•</span>
                                                                        <div className="flex items-center">
                                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                                                                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                                                                            </svg>
                                                                            <span className="ml-1">{course.students} students</span>
                                                                        </div>
                                                                        
                                                                        {course.rating > 0 && (
                                                                            <>
                                                                                <span className="mx-2">•</span>
                                                                                <div className="flex items-center">
                                                                                    {[...Array(5)].map((_, i) => (
                                                                                        <svg
                                                                                            key={i}
                                                                                            className={`w-4 h-4 ${i < Math.floor(course.rating) ? 'text-[#F59E0B]' : 'text-gray-300'
                                                                                                }`}
                                                                                            fill="currentColor"
                                                                                            viewBox="0 0 20 20"
                                                                                        >
                                                                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                                        </svg>
                                                                                    ))}
                                                                                    <span className="ml-1">{course.rating}</span>
                                                                                </div>
                                                                            </>
                                                                        )}
                                                                    </>
                                                                )}
                                                            </div>

                                                            <div className="mt-auto pt-4 flex flex-wrap gap-2">
                                                                <button
                                                                    onClick={() => handleEditCourse(course.id)}
                                                                    className="px-4 py-2 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                                    </svg>
                                                                    Edit Course
                                                                </button>
                                                                
                                                                <button
                                                                    onClick={() => handleAddContent(course.id)}
                                                                    className="px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-lg hover:bg-indigo-600 transition-colors duration-200 flex items-center"
                                                                >
                                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                        <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                                    </svg>
                                                                    Add Content
                                                                </button>
                                                                
                                                                {course.status === 'draft' ? (
                                                                    <button 
                                                                        onClick={async () => {
                                                                            try {
                                                                                const response = await axios.post(
                                                                                    `${import.meta.env.VITE_SERVER_URL}/api/course/publish/${course.id}`,
                                                                                    {},
                                                                                    { withCredentials: true }
                                                                                );
                                                                                
                                                                                if (response.data && response.data.success) {
                                                                                    // Update the course status in the state
                                                                                    const updatedCourses = teacher.courses.map(c => 
                                                                                        c.id === course.id ? {...c, status: 'published'} : c
                                                                                    );
                                                                                    setTeacher(prev => ({...prev, courses: updatedCourses}));
                                                                                    alert("Course published successfully!");
                                                                                }
                                                                            } catch (error) {
                                                                                console.error("Error publishing course:", error);
                                                                                alert("Failed to publish course. Please try again.");
                                                                            }
                                                                        }}
                                                                        className="px-4 py-2 bg-green-100 text-green-700 text-sm rounded-lg hover:bg-green-200 transition-colors duration-200 flex items-center"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Publish
                                                                    </button>
                                                                ) : (
                                                                    <button 
                                                                        onClick={() => {
                                                                            // In a real app, this would navigate to the live course preview
                                                                            window.open(`/course/preview/${course.id}`, '_blank');
                                                                        }}
                                                                        className="px-4 py-2 bg-blue-100 text-blue-700 text-sm rounded-lg hover:bg-blue-200 transition-colors duration-200 flex items-center"
                                                                    >
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                                            <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                        View Live
                                                                    </button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                                
                                            {teacher.courses.filter(course => activeTab === 'drafts' ? course.status === 'draft' : course.status === 'published').length === 0 && (
                                                <div className="text-center py-8">
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-12 w-12 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                    </svg>
                                                    <h3 className="mt-2 text-sm font-medium text-gray-900">No courses found</h3>
                                                    <p className="mt-1 text-sm text-gray-500">
                                                        {activeTab === 'drafts' 
                                                            ? "You don't have any draft courses. Start creating a new course!" 
                                                            : "You haven't published any courses yet."}
                                                    </p>
                                                    <div className="mt-6">
                                                        <button
                                                            onClick={() => setShowAddModal(true)}
                                                            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-[#6C63FF] hover:bg-indigo-600"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="-ml-1 mr-2 h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                            </svg>
                                                            Create New Course
                                                        </button>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">
                        {/* Quick Actions Card */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-gradient-to-r from-[#6C63FF] to-indigo-600 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10"></div>
                                <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>

                                <div className="flex items-start relative z-10">
                                    <div className="flex-shrink-0 bg-white/20 rounded-full p-3 backdrop-blur-sm">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <div className="ml-4">
                                        <h3 className="text-xl font-bold">Quick Actions</h3>
                                        <p className="mt-1 text-indigo-100 text-sm">
                                            Access common teaching tasks
                                        </p>

                                        <div className="mt-5 grid gap-3">
                                            <button
                                                className="px-4 py-2 bg-white text-[#6C63FF] text-sm font-medium rounded-xl hover:bg-indigo-50 transition-colors duration-200 shadow-sm flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
                                                    <path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" />
                                                </svg>
                                                Create New Course
                                            </button>
                                            
                                            <button
                                                className="px-4 py-2 bg-indigo-600/30 text-white text-sm rounded-xl hover:bg-indigo-600/40 transition-colors duration-200 backdrop-blur-sm border border-white/10 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zM14.553 7.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                                                </svg>
                                                Record Video Content
                                            </button>
                                            
                                            <button
                                                className="px-4 py-2 bg-indigo-600/30 text-white text-sm rounded-xl hover:bg-indigo-600/40 transition-colors duration-200 backdrop-blur-sm border border-white/10 flex items-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                                    <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                                </svg>
                                                Upload Materials
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activities */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-semibold text-[#111827]">Recent Activity</h3>
                                    <Link to="#" className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium transition-colors">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {teacher.recentActivities.map(activity => (
                                        <div key={activity.id} className="flex items-start p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200 -mx-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#6C63FF]">
                                                {activity.type === 'course_update' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                                                    </svg>
                                                )}
                                                {activity.type === 'new_student' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6zM16 7a1 1 0 10-2 0v1h-1a1 1 0 100 2h1v1a1 1 0 102 0v-1h1a1 1 0 100-2h-1V7z" />
                                                    </svg>
                                                )}
                                                {activity.type === 'student_review' && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm text-[#111827] font-medium">{activity.message}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-xs text-[#6B7280]">{activity.time}</span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Teaching Stats */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <h3 className="text-lg font-semibold text-[#111827] mb-5">Teaching Stats</h3>

                                <div className="space-y-4">
                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#6B7280]">Course Completion Rate</span>
                                            <span className="font-medium text-[#00C49A]">78%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#00C49A] rounded-full" style={{ width: '78%' }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#6B7280]">Student Satisfaction</span>
                                            <span className="font-medium text-[#F59E0B]">92%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#F59E0B] rounded-full" style={{ width: '92%' }}></div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <div className="flex justify-between items-center text-sm">
                                            <span className="text-[#6B7280]">Content Engagement</span>
                                            <span className="font-medium text-[#6C63FF]">65%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-[#6C63FF] rounded-full" style={{ width: '65%' }}></div>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-5 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#111827] rounded-xl transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                                    </svg>
                                    View Analytics Dashboard
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            {/* Modal for creating new course */}
            {showAddModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3 }}
                        className="bg-white rounded-xl shadow-xl max-w-lg w-full overflow-hidden"
                    >
                        <div className="px-6 py-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-gray-900">Create New Course</h3>
                                <button 
                                    onClick={() => setShowAddModal(false)}
                                    className="text-gray-400 hover:text-gray-500"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                        <form onSubmit={handleCreateCourse}>
                            <div className="p-6 space-y-4">
                                <div>
                                    <label htmlFor="course-title" className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Title
                                    </label>
                                    <input
                                        type="text"
                                        id="course-title"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="e.g. Advanced Stock Trading Strategies"
                                        required
                                    />
                                </div>
                                <div>
                                    <label htmlFor="course-description" className="block text-sm font-medium text-gray-700 mb-1">
                                        Course Description
                                    </label>
                                    <textarea
                                        id="course-description"
                                        rows={4}
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        placeholder="Describe your course..."
                                        required
                                    ></textarea>
                                </div>
                                <div>
                                    <label htmlFor="course-category" className="block text-sm font-medium text-gray-700 mb-1">
                                        Category
                                    </label>
                                    <select
                                        id="course-category"
                                        className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                        required
                                    >
                                        <option value="">Select a category</option>
                                        <option value="stocks">Stocks & Equities</option>
                                        <option value="crypto">Cryptocurrency</option>
                                        <option value="forex">Forex</option>
                                        <option value="options">Options Trading</option>
                                        <option value="analysis">Technical Analysis</option>
                                        <option value="fundamentals">Fundamental Analysis</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="course-level" className="block text-sm font-medium text-gray-700 mb-1">
                                        Difficulty Level
                                    </label>
                                    <div className="flex space-x-4">
                                        {['Beginner', 'Intermediate', 'Advanced'].map(level => (
                                            <label key={level} className="flex items-center">
                                                <input
                                                    type="radio"
                                                    name="difficulty"
                                                    value={level.toLowerCase()}
                                                    className="h-4 w-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                                                />
                                                <span className="ml-2 text-sm text-gray-700">{level}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowAddModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#6C63FF] hover:bg-indigo-700 focus:outline-none"
                                >
                                    Create Course
                                </button>
                            </div>
                        </form>
                    </motion.div>
                </div>
            )}
        </div>
    );
}
