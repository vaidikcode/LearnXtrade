import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import ReadinessIndex from '../components/ReadinessIndex';

export default function Dashboard() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);

    // Check if user is already logged in via auth cookies
    useEffect(() => {
        // Make a request to check authentication status
        const checkAuthStatus = async () => {
            try {
                // Call the API endpoint for authentication verification
                const userResponse = await axios.get(`${import.meta.env.VITE_SERVER_URL}/stdAuth`);
                
                // If request succeeds, user is authenticated via cookies
                console.log("User authenticated:", userResponse.data);
                
                // Extract the student data from the response based on the API structure
                const studentData = userResponse.data.student;
                
                if (studentData) {
                    // Map API courses to the format expected by our UI
                    const mappedCourses = studentData.courses.map(course => ({
                        id: course.courseId?._id || course._id, // Get the _id from the nested courseId object
                        courseIdObj: course.courseId, // Store the entire courseId object for reference
                        title: course.courseId?.name || "Course Title",
                        progress: course.isCompleted ? 100 : 20, // Simplified progress calculation
                        instructor: course.courseId?.creator || "Instructor",
                        description: course.courseId?.description || "",
                        image: course.courseId?.photo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
                        createdAt: course.courseId?.createdAt || "",
                        updatedAt: course.courseId?.updatedAt || "",
                        courseCredits: course.courseId?.credits || 0,
                        isCompleted: course.isCompleted || false
                    }));
                    
                    // Update user state with data from API
                    setUser(prevUser => ({
                        ...prevUser,
                        name: studentData.name || "Student",
                        email: studentData.email || "",
                        credits: studentData.credits || 0,
                        profilePicture: studentData.profilePicture || "",
                        role: "student",
                        enrolledCourses: mappedCourses,
                        userId: studentData._id || "",
                        // Keep some default values for fields not provided by API
                        trustScore: studentData.trustScore || prevUser.trustScore,
                        badges: prevUser.badges, // Keep default badges for now
                        notifications: prevUser.notifications, // Keep default notifications
                        recommendedCourses: prevUser.recommendedCourses
                    }));
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error("Authentication error:", error);
                navigate('/login');
            }
        };
        
        checkAuthStatus();
    }, [navigate]);

    const [user, setUser] = useState({
        name: "Alex Johnson",
        role: "student", // "student" or "educator"
        credits: 250,
        trustScore: 78, // out of 100
        completedCourses: 4,
        enrolledCourses: [
            { id: 1, title: "Introduction to Stock Trading", progress: 85, instructor: "Sarah Williams", image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 2, title: "Cryptocurrency Fundamentals", progress: 42, instructor: "Michael Chen", image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 3, title: "Technical Analysis Basics", progress: 16, instructor: "Robert Taylor", image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
        ],
        recommendedCourses: [
            { id: 4, title: "Advanced Trading Strategies", instructor: "Emma Davis", rating: 4.8, students: 1243, image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" },
            { id: 5, title: "Investment Portfolio Management", instructor: "David Wilson", rating: 4.6, students: 892, image: "https://images.unsplash.com/photo-1579225663317-c0505f91d60d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60" }
        ],
        badges: [
            { id: 1, name: "Fast Learner", icon: "🚀" },
            { id: 2, name: "Knowledge Seeker", icon: "📚" },
            { id: 3, name: "Trading Beginner", icon: "📈" }
        ],
        notifications: [
            { id: 1, message: "New course 'Market Psychology' is now available", time: "2 hours ago" },
            { id: 2, message: "Your course 'Intro to Stock Trading' has been updated", time: "1 day ago" },
            { id: 3, message: "You've earned the 'Trading Beginner' badge!", time: "3 days ago" }
        ]
    });

    const [activeTab, setActiveTab] = useState('enrolled');
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleAddCredits = () => {
        console.log("Add credits clicked");
        // In a real app, this would open a payment modal
    };

    const handleContinueCourse = (courseId) => {
        console.log(`Continue course ${courseId} clicked`);
        // Navigate to the course detail page with the correct courseId
        // The courseId should be from the courseId._id property in the API response
        navigate(`/course/${courseId}`);
    };

    const handleBecomeConsultant = () => {
        console.log("Become consultant clicked");
        // In a real app, this would start the consultant application process
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] bg-pattern">
            {/* Header */}
            <header className="bg-white shadow-md sticky top-0 z-10 border-b border-indigo-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                                LearnXtrade
                            </span>
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
                                    {user.profilePicture ? (
                                        <div className="h-9 w-9 rounded-full overflow-hidden shadow-md border-2 border-white">
                                            <img 
                                                src={user.profilePicture} 
                                                alt={user.name}
                                                className="h-full w-full object-cover" 
                                            />
                                        </div>
                                    ) : (
                                        <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-md">
                                            {user.name?.charAt(0) || "U"}
                                        </div>
                                    )}
                                    <span className="hidden md:block text-sm font-medium text-[#111827]">{user.name}</span>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 ring-1 ring-[#6C63FF]/10">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Your Profile</Link>
                                        <Link to="/settings" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Settings</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link to="/logout" className="block px-4 py-2 text-sm text-[#111827] hover:bg-red-50 hover:text-[#EF4444]">Sign out</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Banner */}
                <div className="transition-all duration-500 ease-out mb-8">
                    <div className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] rounded-2xl shadow-xl p-6 text-white overflow-hidden relative">
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-white/10 rounded-full"></div>
                        <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/10 to-transparent"></div>
                        <div className="absolute -bottom-8 -left-8 w-24 h-24 bg-white/10 rounded-full"></div>

                        <div className="relative z-10">
                            <div className="flex items-center">
                                <h2 className="text-2xl font-bold">Welcome back, {user.name}!</h2>
                                <div className="ml-4 px-2 py-1 bg-white/20 rounded-full text-xs backdrop-blur-sm">
                                    {user.role === 'student' ? 'Student' : 'Educator'} Account
                                </div>
                            </div>
                            <p className="mt-1 text-indigo-100 text-sm">
                                {user.email}
                            </p>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                    <span className="font-medium">{user.enrolledCourses.length}</span> Courses in Progress
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                    <span className="font-medium">{user.credits}</span> Credits Available
                                </div>
                                <div className="bg-white/20 px-4 py-2 rounded-lg text-sm backdrop-blur-sm border border-white/10">
                                    <span className="font-medium">{user.badges?.length || 0}</span> Badges Earned
                                </div>
                                <button className="ml-auto bg-white text-[#6C63FF] px-5 py-2 rounded-lg font-medium hover:bg-opacity-90 transition shadow-sm">
                                    View Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Column */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Top Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Credits Wallet Card */}
                            <div className="transition-all duration-500 ease-out">
                                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 relative overflow-hidden">
                                    <div className="absolute -right-6 -top-6 w-24 h-24 bg-[#00C49A]/5 rounded-full"></div>
                                    <div className="absolute -left-6 -bottom-6 w-24 h-24 bg-[#00C49A]/5 rounded-full"></div>

                                    <div className="relative">
                                        <div className="flex items-center">
                                            <div className="flex-shrink-0 bg-gradient-to-br from-[#00C49A] to-teal-500 text-white p-3 rounded-xl shadow-sm">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                            <div className="ml-4">
                                                <h3 className="text-lg font-semibold text-[#111827]">Credits Wallet</h3>
                                                <p className="text-[#6B7280] text-sm">Currency for premium content</p>
                                            </div>
                                        </div>

                                        <div className="mt-5">
                                            <div className="text-3xl font-bold text-[#111827]">{user.credits}</div>
                                            <p className="text-[#6B7280] text-sm">Available Credits</p>
                                            <p className="text-[#00C49A] text-xs mt-1">User ID: {user.userId ? user.userId.substring(0, 8) + '...' : 'Loading...'}</p>
                                        </div>

                                        <div className="mt-6 grid grid-cols-2 gap-3">
                                            <button
                                                onClick={handleAddCredits}
                                                className="px-4 py-2 bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white text-sm rounded-xl hover:shadow-md transition-all duration-200 transform hover:translate-y-[-2px] flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                                                </svg>
                                                Add Credits
                                            </button>
                                            <button
                                                className="px-4 py-2 border border-gray-200 text-[#111827] text-sm rounded-xl hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center"
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clipRule="evenodd" />
                                                </svg>
                                                History
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Trust Score */}
                            {user.role === 'student' && (
                                <div className="transition-all duration-500 ease-out">
                                    <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100 h-full flex flex-col relative overflow-hidden">
                                        <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-[#F59E0B]/5 rounded-full"></div>

                                        <div className="relative">
                                            <div className="flex items-center justify-between">
                                                <h3 className="text-lg font-semibold text-[#111827]">Trust Score</h3>
                                                <div className="text-xs px-3 py-1.5 bg-indigo-50 text-[#6C63FF] rounded-full font-medium">
                                                    {user.trustScore >= 75 ? 'Excellent' : user.trustScore >= 50 ? 'Good' : 'Needs Improvement'}
                                                </div>
                                            </div>

                                            <div className="flex-1 flex flex-col items-center justify-center my-6">
                                                <div className="relative w-28 h-28">
                                                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke="#E5E7EB"
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeDasharray="100, 100"
                                                        />
                                                        <path
                                                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                                            fill="none"
                                                            stroke={user.trustScore >= 75 ? '#00C49A' : user.trustScore >= 50 ? '#F59E0B' : '#EF4444'}
                                                            strokeWidth="3"
                                                            strokeLinecap="round"
                                                            strokeDasharray={`${user.trustScore}, 100`}
                                                        />
                                                    </svg>
                                                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                                                        <span className="text-3xl font-bold text-[#111827]">{user.trustScore}</span>
                                                        <span className="text-xs text-[#6B7280]">/ 100</span>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-[#6B7280] mt-4 text-center">
                                                    Your trustworthiness score based on activity and engagement
                                                </p>
                                            </div>

                                            <div className="mt-auto">
                                                <button className="w-full py-2.5 text-[#6C63FF] bg-indigo-50 hover:bg-indigo-100 rounded-xl transition-colors duration-200 text-sm font-medium">
                                                    How to Improve
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Learning Readiness Index */}
                        <div className="transition-all duration-500 ease-out">
                            <ReadinessIndex userId={user.userId} />
                        </div>

                        {/* Badges Section */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center justify-between mb-6">
                                    <h3 className="text-lg font-semibold text-[#111827]">Earned Badges</h3>
                                    <button className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium transition-colors">
                                        View All
                                    </button>
                                </div>

                                <div className="flex flex-wrap gap-8">
                                    {user.badges.map(badge => (
                                        <div key={badge.id} className="flex flex-col items-center group">
                                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-500 flex items-center justify-center text-2xl shadow-md transform transition-transform duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                                {badge.icon}
                                            </div>
                                            <span className="mt-3 text-sm font-medium text-[#111827]">{badge.name}</span>
                                        </div>
                                    ))}
                                    <div className="flex flex-col items-center opacity-60">
                                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-2xl border-2 border-dashed border-gray-300">
                                            🔒
                                        </div>
                                        <span className="mt-3 text-sm font-medium text-[#6B7280]">Coming Soon</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Course Section with Tabs */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                                <div className="border-b border-gray-100">
                                    <div className="flex">
                                        <button
                                            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === 'enrolled'
                                                ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                                : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                                } transition-colors duration-200`}
                                            onClick={() => setActiveTab('enrolled')}
                                        >
                                            My Courses
                                        </button>
                                        <button
                                            className={`px-6 py-4 text-sm font-medium focus:outline-none ${activeTab === 'recommended'
                                                ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                                : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                                } transition-colors duration-200`}
                                            onClick={() => setActiveTab('recommended')}
                                        >
                                            Recommended
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6">
                                    {activeTab === 'enrolled' ? (
                                        <div className="space-y-5">
                                            {user.enrolledCourses.length > 0 ? (
                                                user.enrolledCourses.map(course => (
                                                    <div key={course.id} className="flex flex-col md:flex-row border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                                                        <div className="md:w-48 h-32 md:h-auto relative overflow-hidden">
                                                            <img
                                                                src={course.image}
                                                                alt={course.title}
                                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                            />
                                                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                                                            {course.courseCredits > 0 && (
                                                                <div className="absolute top-2 right-2 bg-[#00C49A]/90 text-white text-xs rounded-full px-2 py-1 font-medium">
                                                                    {course.courseCredits} Credits
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="p-5 flex-1 flex flex-col">
                                                            <h4 className="text-lg font-semibold text-[#111827] group-hover:text-[#6C63FF] transition-colors duration-200">{course.title}</h4>
                                                            <div className="flex items-center mt-1">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                                </svg>
                                                                <p className="text-sm text-[#6B7280] ml-1">{course.instructor}</p>
                                                            </div>
                                                            
                                                            {course.description && (
                                                                <p className="text-sm text-[#6B7280] mt-2 line-clamp-2">
                                                                    {course.description}
                                                                </p>
                                                            )}
                                                            
                                                            <div className="mt-2 flex flex-wrap gap-2">
                                                                <span className="text-xs bg-indigo-50 text-[#6C63FF] px-2 py-1 rounded-md">
                                                                    {new Date(course.createdAt).toLocaleDateString()}
                                                                </span>
                                                                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                                                                    {course.isCompleted ? 'Completed' : 'In Progress'}
                                                                </span>
                                                            </div>

                                                            <div className="mt-auto pt-4">
                                                                <div className="flex items-center justify-between">
                                                                    <div className="w-full max-w-xs">
                                                                        <div className="flex justify-between text-xs mb-1">
                                                                            <span className="text-[#6B7280]">Progress</span>
                                                                            <span className={`font-medium ${course.progress >= 75 ? 'text-[#00C49A]' :
                                                                                course.progress >= 25 ? 'text-[#6C63FF]' : 'text-[#6B7280]'
                                                                                }`}>{course.progress}%</span>
                                                                        </div>
                                                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                                                            <div
                                                                                className={`h-full rounded-full ${course.progress >= 75 ? 'bg-[#00C49A]' :
                                                                                    course.progress >= 25 ? 'bg-[#6C63FF]' : 'bg-gray-400'
                                                                                    }`}
                                                                                style={{ width: `${course.progress}%`, transition: 'width 1s ease-in-out' }}
                                                                            ></div>
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        onClick={() => handleContinueCourse(course.id)}
                                                                        className="ml-4 px-5 py-2 bg-[#6C63FF] text-white text-sm rounded-xl hover:bg-indigo-600 transition-colors duration-200 shadow-sm flex items-center"
                                                                    >
                                                                        <span>Continue</span>
                                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                            <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                                        </svg>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            ) : (
                                                <div className="flex flex-col items-center justify-center py-10">
                                                    <div className="bg-indigo-50 p-3 rounded-full">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-[#6C63FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                                        </svg>
                                                    </div>
                                                    <h3 className="mt-4 text-lg font-medium text-gray-900">No courses enrolled</h3>
                                                    <p className="mt-1 text-sm text-gray-500">Browse our course catalog to start your learning journey!</p>
                                                    <button className="mt-4 px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-xl hover:bg-indigo-600">
                                                        Browse Courses
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                                            {user.recommendedCourses.map(course => (
                                                <div key={course.id} className="border border-gray-100 rounded-xl overflow-hidden hover:shadow-md transition-shadow duration-300 group">
                                                    <div className="h-40 overflow-hidden relative">
                                                        <img
                                                            src={course.image}
                                                            alt={course.title}
                                                            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                        />
                                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                                                        <div className="absolute bottom-0 left-0 p-4">
                                                            <div className="px-3 py-1.5 bg-white/90 text-xs font-medium text-[#6C63FF] rounded-lg backdrop-blur-sm">
                                                                Recommended for you
                                                            </div>
                                                        </div>
                                                    </div>

                                                    <div className="p-5">
                                                        <h4 className="text-lg font-semibold text-[#111827] group-hover:text-[#6C63FF] transition-colors duration-200">{course.title}</h4>
                                                        <div className="flex items-center mt-1">
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                            </svg>
                                                            <p className="text-sm text-[#6B7280] ml-1">{course.instructor}</p>
                                                        </div>

                                                        <div className="mt-3 flex items-center">
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
                                                                <span className="ml-1 text-sm text-[#6B7280]">{course.rating}</span>
                                                            </div>
                                                            <span className="mx-2 text-gray-300">•</span>
                                                            <span className="text-sm text-[#6B7280]">{course.students.toLocaleString()} students</span>
                                                        </div>

                                                        <div className="mt-4 flex justify-between items-center">
                                                            <div className="flex items-center">
                                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00C49A]" viewBox="0 0 20 20" fill="currentColor">
                                                                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                                                </svg>
                                                                <span className="ml-1 text-lg font-bold text-[#00C49A]">50</span>
                                                            </div>
                                                            <button className="px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-xl hover:bg-indigo-600 transition-colors duration-200 shadow-sm">
                                                                Enroll Now
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Column */}
                    <div className="space-y-8">
                        {/* Consultant Section */}
                        {user.role === 'student' && user.trustScore >= 75 && (
                            <div className="transition-all duration-500 ease-out">
                                <div className="bg-gradient-to-r from-[#00C49A] to-teal-500 rounded-xl shadow-lg p-6 text-white relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mt-10 -mr-10"></div>
                                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full"></div>

                                    <div className="flex items-start relative z-10">
                                        <div className="flex-shrink-0 bg-white/20 rounded-full p-3 backdrop-blur-sm">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-4">
                                            <h3 className="text-xl font-bold">Become a Consultant</h3>
                                            <p className="mt-1 text-teal-50 text-sm">
                                                Your trust score qualifies you to help others and earn additional credits.
                                            </p>

                                            <div className="mt-5 flex space-x-3">
                                                <button
                                                    onClick={handleBecomeConsultant}
                                                    className="px-4 py-2 bg-white text-[#00C49A] text-sm font-medium rounded-xl hover:bg-teal-50 transition-colors duration-200 shadow-sm"
                                                >
                                                    Apply Now
                                                </button>
                                                <button className="px-4 py-2 bg-teal-600/30 text-white text-sm rounded-xl hover:bg-teal-600/40 transition-colors duration-200 backdrop-blur-sm border border-white/10">
                                                    Learn More
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Notifications Panel */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-lg font-semibold text-[#111827]">Notifications</h3>
                                    <Link to="#" className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium transition-colors">
                                        View All
                                    </Link>
                                </div>

                                <div className="space-y-4">
                                    {user.notifications.map(notification => (
                                        <div key={notification.id} className="flex items-start p-3 hover:bg-indigo-50 rounded-lg transition-colors duration-200 -mx-3">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#6C63FF]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                                </svg>
                                            </div>
                                            <div className="ml-3 flex-1">
                                                <p className="text-sm text-[#111827] font-medium">{notification.message}</p>
                                                <div className="flex items-center mt-1">
                                                    <span className="text-xs text-[#6B7280]">{notification.time}</span>
                                                    <button className="ml-auto text-xs text-[#6C63FF] hover:text-indigo-800 font-medium">
                                                        Mark as read
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Learning Stats Card */}
                        <div className="transition-all duration-500 ease-out">
                            <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow duration-300 border border-gray-100">
                                <h3 className="text-lg font-semibold text-[#111827] mb-5">Learning Stats</h3>

                                <div className="space-y-4">
                                    <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-[#6C63FF]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#111827]">12-Day Streak</p>
                                            <p className="text-xs text-[#6C63FF]">Keep it up! You're on fire 🔥</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-teal-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-teal-100 flex items-center justify-center text-[#00C49A]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#111827]">42 Hours Total</p>
                                            <p className="text-xs text-[#00C49A]">Time spent learning</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center p-3 bg-amber-50 rounded-lg">
                                        <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-[#F59E0B]">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-[#111827]">86% Completion</p>
                                            <p className="text-xs text-[#F59E0B]">Of started courses</p>
                                        </div>
                                    </div>
                                </div>

                                <button className="mt-5 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#111827] rounded-xl transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z" clipRule="evenodd" />
                                    </svg>
                                    View Detailed Stats
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
                        <footer className="bg-[#111827] text-gray-300 py-12">
                {/* Footer content remains the same */}
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">LearnXtrade</h3>
                            <p className="text-gray-400 text-sm">
                                A modern platform for learning new skills, connecting with educators, and tracking your progress.
                            </p>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Quick Links</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Courses</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Categories</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Company</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">About Us</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Careers</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Blog</a></li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="text-white font-medium mb-4">Legal</h4>
                            <ul className="space-y-2">
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Terms of Service</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Privacy Policy</a></li>
                                <li><a href="#" className="text-gray-400 hover:text-white transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-gray-700 text-sm text-gray-400 text-center">
                        <p>© {new Date().getFullYear()} LearnXtrade. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

