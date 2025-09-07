import React, { useState, useEffect, useRef } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion } from 'framer-motion';

// Utility function to randomly assign priority flags to queries
const assignPriorityFlag = () => {
    const priorities = [
        { flag: 'Critical', color: 'bg-red-500 text-white' },
        { flag: 'High', color: 'bg-orange-500 text-white' },
        { flag: 'Medium', color: 'bg-yellow-500 text-black' },
        { flag: 'Low', color: 'bg-green-500 text-white' },
        { flag: 'Not Important', color: 'bg-blue-500 text-white' }
    ];
    
    // Return a random priority from the array
    return priorities[Math.floor(Math.random() * priorities.length)];
};

export default function CourseDetail() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [course, setCourse] = useState(null);
    const [activeSection, setActiveSection] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);
    const [currentContentIndex, setCurrentContentIndex] = useState(0);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessage, setChatMessage] = useState("");
    const [chatHistory, setChatHistory] = useState([]);
    const [isChatLoading, setIsChatLoading] = useState(false);
    const [priorityFilter, setPriorityFilter] = useState(''); // '' means show all
    const chatEndRef = useRef(null);
    const [instructor, setInstructor] = useState({
        name: "",
        profilePicture: "",
        expertise: "Trading Educator"
    });
    
    // Function to handle chat submission
    const handleChatSubmit = async () => {
        if (!chatMessage.trim()) return;
        
        // Assign a random priority flag to the user message
        const priority = assignPriorityFlag();
        
        // Add the user's message to the chat history with priority flag
        const userMessage = {
            isUser: true,
            message: chatMessage,
            priority: priority.flag,
            priorityColor: priority.color,
            timestamp: new Date()
        };
        
        setChatHistory(prev => [...prev, userMessage]);
        setIsChatLoading(true);
        
        try {
            // Make request to the RAG endpoint
            const response = await axios.post('http://localhost:8000/ask', {
                subject: course?.title || "mysubject", // Use the course title as the subject or default
                question: chatMessage
            });
            
            // Add the AI response to the chat history
            setChatHistory(prev => [...prev, {
                isUser: false,
                message: response.data.answer || "I'm sorry, I couldn't generate a response.",
                timestamp: new Date()
            }]);
            
        } catch (error) {
            console.error("Error getting chat response:", error);
            
            // Add an error message to the chat
            setChatHistory(prev => [...prev, {
                isUser: false,
                message: "Sorry, I'm having trouble connecting to the knowledge base. Please try again later.",
                timestamp: new Date()
            }]);
            
        } finally {
            setIsChatLoading(false);
            setChatMessage("");
            
            // Scroll to the bottom of the chat
            setTimeout(() => {
                chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 100);
        }
    };
    
    // Add welcome message when component mounts
    useEffect(() => {
        setChatHistory([
            {
                isUser: false,
                message: "👋 Hi there! I'm your course assistant. Ask me anything about this course or related topics, and I'll do my best to help you!",
                timestamp: new Date()
            }
        ]);
    }, []);
    
    // Scroll to bottom when chat history changes
    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatHistory]);

    useEffect(() => {
        const fetchCourseDetails = async () => {
            try {
                setIsLoading(true);
                
                // Use the student/getMyCourses endpoint to get course details
                const response = await axios.get(
                    `${import.meta.env.VITE_SERVER_URL}/student/getMyCourses`,
                    { withCredentials: true }
                );
                
                console.log("API response:", response.data);
                
                // Find the specific course by ID
                // The API returns courses with nested courseId objects
                const courseData = response.data.courses.find(c => 
                    (c.courseId && c.courseId._id === courseId) || c._id === courseId
                );
                
                if (courseData) {
                    console.log("Found course data:", courseData);
                    
                    // Check if courseData has a nested courseId object
                    const courseInfo = courseData.courseId || courseData;
                    
                    // Format the course data for our UI
                    const formattedCourse = {
                        id: courseInfo._id,
                        title: courseInfo.name || "Course",
                        description: courseInfo.description || "No description available",
                        image: courseInfo.photo || "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1200&q=80",
                        progress: courseData.progress || 0,
                        createdAt: courseInfo.createdAt,
                        updatedAt: courseInfo.updatedAt,
                        credits: courseInfo.credits || 0,
                        content: courseInfo.content || [],
                        instructor: courseInfo.creator || {},
                        isCompleted: courseData.isCompleted || false
                    };
                    
                    setCourse(formattedCourse);
                    
                    // If there's instructor info, fetch additional details
                    const creatorId = courseInfo.creator || courseData.courseId?.creator;
                    if (creatorId) {
                        try {
                            const instructorResponse = await axios.get(
                                `${import.meta.env.VITE_SERVER_URL}/api/teacher/${creatorId}`,
                                { withCredentials: true }
                            );
                            
                            if (instructorResponse.data) {
                                setInstructor({
                                    name: instructorResponse.data.name || "Instructor",
                                    profilePicture: instructorResponse.data.profilePicture || "",
                                    expertise: "Trading Educator"
                                });
                            }
                        } catch (err) {
                            console.error("Error fetching instructor details:", err);
                        }
                    }
                } else {
                    console.error("Course not found");
                    navigate('/dashboard');
                }
                
                setIsLoading(false);
            } catch (error) {
                console.error("Error fetching course details:", error);
                setIsLoading(false);
                navigate('/dashboard');
            }
        };
        
        fetchCourseDetails();
    }, [courseId, navigate]);
    
    const handleContentNav = (direction) => {
        if (direction === 'next' && currentContentIndex < (course?.content?.length - 1 || 0)) {
            setCurrentContentIndex(prev => prev + 1);
        } else if (direction === 'prev' && currentContentIndex > 0) {
            setCurrentContentIndex(prev => prev - 1);
        }
    };
    
    const handleCompleteContent = async () => {
        try {
            // In a real implementation, you would update the progress through the API
            await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/student/updateProgress`,
                {
                    courseId: course.id,
                    progress: Math.min(course.progress + 10, 100)
                },
                { withCredentials: true }
            );
            
            // Update local state
            setCourse(prev => ({
                ...prev,
                progress: Math.min((prev.progress || 0) + 10, 100),
                isCompleted: (prev.progress || 0) + 10 >= 100
            }));
            
            // Move to next content item if available
            if (currentContentIndex < (course?.content?.length - 1 || 0)) {
                setCurrentContentIndex(prev => prev + 1);
            }
        } catch (error) {
            console.error("Error updating progress:", error);
        }
    };
    
    // Helper function to render different types of content
    const renderContent = (contentItem) => {
        switch (contentItem?.type?.toLowerCase()) {
            case 'video':
                return (
                    <div className="rounded-xl overflow-hidden aspect-video">
                        <video 
                            className="w-full h-full object-cover"
                            controls
                            src={contentItem.url}
                        />
                    </div>
                );
            case 'document':
            case 'pdf':
                return (
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-[#6C63FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="mt-4 font-medium">Document Resource</h4>
                        <p className="text-sm text-gray-500 mt-1">PDF or document material</p>
                        <a 
                            href={contentItem.url}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-4 inline-block px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-lg hover:bg-indigo-600"
                        >
                            Open Document
                        </a>
                    </div>
                );
            case 'image':
                return (
                    <div className="rounded-xl overflow-hidden">
                        <img
                            src={contentItem.url}
                            alt="Course content"
                            className="w-full h-auto object-cover"
                        />
                    </div>
                );
            case 'audio':
                return (
                    <div className="rounded-xl bg-gradient-to-r from-indigo-50 to-purple-50 p-6">
                        <div className="flex items-center justify-center mb-4">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-[#6C63FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3" />
                            </svg>
                        </div>
                        <audio controls className="w-full">
                            <source src={contentItem.url} />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                );
            default:
                return (
                    <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-50 p-6 text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <h4 className="mt-4 font-medium">Resource</h4>
                        <p className="text-sm text-gray-500 mt-1">Unknown content type</p>
                        <a 
                            href={contentItem.url}
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="mt-4 inline-block px-4 py-2 bg-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-300"
                        >
                            View Resource
                        </a>
                    </div>
                );
        }
    };
    
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#6C63FF] mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading course content...</p>
                </div>
            </div>
        );
    }
    
    if (!course) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#F9FAFB]">
                <div className="text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h2 className="mt-4 text-xl font-bold text-gray-700">Course Not Found</h2>
                    <p className="mt-2 text-gray-500">The course you're looking for doesn't exist or you don't have access to it.</p>
                    <Link
                        to="/dashboard"
                        className="mt-6 inline-block px-5 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-600 transition-colors"
                    >
                        Back to Dashboard
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F9FAFB] bg-pattern">
            {/* ChatBuddy Sidebar */}
            <div className={`fixed right-0 top-0 h-screen w-[90%] sm:w-80 lg:w-96 bg-white shadow-xl z-50 transform ${isChatOpen ? 'translate-x-0' : 'translate-x-full'} transition-transform duration-300 ease-in-out flex flex-col`}>
                <div className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white p-4">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center space-x-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            <h3 className="font-semibold text-lg">ChatBuddy</h3>
                        </div>
                        <div className="flex items-center space-x-2">
                            <button 
                                onClick={() => setIsChatOpen(false)}
                                className="hover:bg-indigo-700/50 p-1.5 rounded-full transition-colors"
                                aria-label="Close chat"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </div>
                    </div>
                    
                    {/* Priority indicators/filters */}
                    <div className="mt-3 flex flex-col text-xs font-medium">
                        <div className="flex space-x-2 overflow-x-auto pb-1">
                            <button 
                                onClick={() => setPriorityFilter(priorityFilter === 'Critical' ? '' : 'Critical')}
                                className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                                    priorityFilter === 'Critical' 
                                    ? 'bg-red-600 ring-2 ring-white' 
                                    : 'bg-red-500 hover:bg-red-600'
                                }`}
                                title="Teacher will resolve your doubt ASAP in a one-to-one mentoring session"
                            >
                                Critical: {chatHistory.filter(chat => chat.priority === 'Critical').length}
                            </button>
                            <button 
                                onClick={() => setPriorityFilter(priorityFilter === 'High' ? '' : 'High')}
                                className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                                    priorityFilter === 'High' 
                                    ? 'bg-orange-600 ring-2 ring-white' 
                                    : 'bg-orange-500 hover:bg-orange-600'
                                }`}
                            >
                                High: {chatHistory.filter(chat => chat.priority === 'High').length}
                            </button>
                            <button 
                                onClick={() => setPriorityFilter(priorityFilter === 'Medium' ? '' : 'Medium')}
                                className={`px-2 py-1 text-black rounded-md whitespace-nowrap transition-colors ${
                                    priorityFilter === 'Medium' 
                                    ? 'bg-yellow-400 ring-2 ring-white' 
                                    : 'bg-yellow-500 hover:bg-yellow-400'
                                }`}
                            >
                                Medium: {chatHistory.filter(chat => chat.priority === 'Medium').length}
                            </button>
                            <button 
                                onClick={() => setPriorityFilter(priorityFilter === 'Low' ? '' : 'Low')}
                                className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                                    priorityFilter === 'Low' 
                                    ? 'bg-green-600 ring-2 ring-white' 
                                    : 'bg-green-500 hover:bg-green-600'
                                }`}
                            >
                                Low: {chatHistory.filter(chat => chat.priority === 'Low').length}
                            </button>
                            <button 
                                onClick={() => setPriorityFilter(priorityFilter === 'Not Important' ? '' : 'Not Important')}
                                className={`px-2 py-1 rounded-md whitespace-nowrap transition-colors ${
                                    priorityFilter === 'Not Important' 
                                    ? 'bg-blue-600 ring-2 ring-white' 
                                    : 'bg-blue-500 hover:bg-blue-600'
                                }`}
                            >
                                Not Important: {chatHistory.filter(chat => chat.priority === 'Not Important').length}
                            </button>
                        </div>
                        <div className="mt-1 text-center">
                            <p className="text-xs text-red-500 font-medium">
                                Critical questions will be resolved by your teacher ASAP in a one-to-one mentoring session
                            </p>
                        </div>
                    </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
                    {/* "All Priorities" button if a filter is active */}
                    {priorityFilter && (
                        <div className="flex justify-center mb-2">
                            <button 
                                onClick={() => setPriorityFilter('')}
                                className="text-xs bg-gray-200 text-gray-800 px-3 py-1 rounded-full hover:bg-gray-300 transition-colors"
                            >
                                Show All Messages
                            </button>
                        </div>
                    )}

                    {/* If a filter is active, add a heading */}
                    {priorityFilter && (
                        <div className="text-center mb-2">
                            <span className="text-xs text-gray-500 font-medium">Showing {priorityFilter} priority messages</span>
                        </div>
                    )}
                    
                    {chatHistory
                        // Apply the priority filter if one is selected
                        .filter(chat => !priorityFilter || chat.priority === priorityFilter)
                        .map((chat, index) => (
                            <div key={index} className={`flex ${chat.isUser ? 'justify-end' : 'justify-start'}`}>
                                <div className={`p-3 rounded-2xl shadow-sm max-w-[85%] ${
                                    chat.isUser 
                                    ? 'bg-[#6C63FF] text-white' 
                                    : 'bg-white border border-gray-100'
                                }`}>
                                    {/* Priority Flag (only show for user messages) */}
                                    {chat.isUser && chat.priority && (
                                        <div className="mb-2 flex items-center">
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${chat.priorityColor}`}>
                                                {chat.priority}
                                            </span>
                                            {chat.priority === 'Critical' && (
                                                <span className="ml-2 text-xs text-red-500">
                                                    Teacher will resolve your doubt ASAP in a one-to-one mentoring session
                                                </span>
                                            )}
                                        </div>
                                    )}
                                    
                                    <p className={`text-sm ${chat.isUser ? 'text-white' : 'text-gray-800'}`}>
                                        {chat.message}
                                    </p>
                                    <div className={`text-[10px] mt-1 text-right ${chat.isUser ? 'text-indigo-200' : 'text-gray-400'}`}>
                                        {chat.isUser ? 'You' : 'ChatBuddy'} • {chat.timestamp ? chat.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                    {isChatLoading && (
                        <div className="flex justify-start">
                            <div className="p-3 rounded-2xl shadow-sm bg-white border border-gray-100 max-w-[85%]">
                                <div className="flex space-x-1 items-center h-6">
                                    <div className="w-2 h-2 rounded-full bg-[#6C63FF]/60 animate-pulse"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#6C63FF]/60 animate-pulse delay-150"></div>
                                    <div className="w-2 h-2 rounded-full bg-[#6C63FF]/60 animate-pulse delay-300"></div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} className="h-4" />
                </div>
                <div className="p-4 border-t border-gray-200 bg-white">
                    <form 
                        className="flex space-x-2"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (chatMessage.trim()) {
                                handleChatSubmit();
                            }
                        }}
                    >
                        <input
                            type="text"
                            value={chatMessage}
                            onChange={(e) => setChatMessage(e.target.value)}
                            placeholder="Ask anything about this course..."
                            className="flex-1 border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#6C63FF] text-sm"
                            disabled={isChatLoading}
                        />
                        <button
                            type="submit"
                            disabled={isChatLoading || !chatMessage.trim()}
                            className={`bg-[#6C63FF] text-white rounded-lg p-2.5 ${
                                isChatLoading || !chatMessage.trim() ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700 shadow-sm'
                            } transition-colors`}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </form>
                    <div className="text-xs text-center mt-2 text-gray-500">
                        Powered by LearnXtrade RAG Technology
                    </div>
                </div>
            </div>
            
            {/* Chat Button */}
            {!isChatOpen && (
                <button
                    onClick={() => setIsChatOpen(true)}
                    className="fixed bottom-6 right-6 bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white w-16 h-16 rounded-full flex items-center justify-center shadow-xl hover:shadow-lg hover:scale-105 transition-all duration-200 z-40"
                    aria-label="Open chat"
                >
                    <div className="relative">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                        </svg>
                        {/* Notification badge showing critical message count */}
                        {chatHistory.filter(chat => chat.priority === 'Critical').length > 0 && (
                            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center text-xs font-bold">
                                {chatHistory.filter(chat => chat.priority === 'Critical').length}
                            </span>
                        )}
                    </div>
                    <span className="sr-only">Open ChatBuddy</span>
                </button>
            )}
            
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
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-md">
                                        U
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                {isMenuOpen && (
                                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 ring-1 ring-[#6C63FF]/10">
                                        <Link to="/profile" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Your Profile</Link>
                                        <Link to="/dashboard" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Dashboard</Link>
                                        <div className="border-t border-gray-100 my-1"></div>
                                        <Link to="/logout" className="block px-4 py-2 text-sm text-[#111827] hover:bg-red-50 hover:text-[#EF4444]">Sign out</Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {/* Course Hero Section */}
            <div className="relative">
                <div className="w-full h-72 md:h-80 lg:h-96 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/10 z-10"></div>
                    <img 
                        src={course.image} 
                        alt={course.title}
                        className="w-full h-full object-cover"
                    />
                </div>
                
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 z-20">
                    <div className="bg-white rounded-xl shadow-xl p-6 md:p-8">
                        <div className="md:flex md:items-start">
                            <div className="flex-grow">
                                <div className="flex items-center flex-wrap gap-2 mb-2">
                                    <span className="px-3 py-1 bg-indigo-100 text-indigo-800 text-xs rounded-full font-medium">
                                        {course.credits} Credits
                                    </span>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs rounded-full font-medium">
                                        {course.isCompleted ? 'Completed' : `${course.progress || 0}% Complete`}
                                    </span>
                                    <span className="px-3 py-1 bg-purple-100 text-purple-800 text-xs rounded-full font-medium">
                                        Updated {new Date(course.updatedAt).toLocaleDateString()}
                                    </span>
                                </div>
                                
                                <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{course.title}</h1>
                                
                                <div className="mt-4 flex items-center">
                                    {instructor.profilePicture ? (
                                        <img 
                                            src={instructor.profilePicture} 
                                            alt={instructor.name} 
                                            className="h-10 w-10 rounded-full border-2 border-white shadow-sm"
                                        />
                                    ) : (
                                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-sm">
                                            {instructor.name.charAt(0) || "I"}
                                        </div>
                                    )}
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900">{instructor.name}</p>
                                        <p className="text-xs text-gray-500">{instructor.expertise}</p>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="mt-6 md:mt-0 flex flex-col items-end">
                                <div className="flex items-center mb-2">
                                    <div className="w-full max-w-[200px]">
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="text-[#6B7280]">Your Progress</span>
                                            <span className={`font-medium ${course.progress >= 75 ? 'text-[#00C49A]' :
                                                course.progress >= 25 ? 'text-[#6C63FF]' : 'text-[#6B7280]'
                                                }`}>{course.progress || 0}%</span>
                                        </div>
                                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                            <div
                                                className={`h-full rounded-full ${course.progress >= 75 ? 'bg-[#00C49A]' :
                                                    course.progress >= 25 ? 'bg-[#6C63FF]' : 'bg-gray-400'
                                                    }`}
                                                style={{ width: `${course.progress || 0}%`, transition: 'width 1s ease-in-out' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="flex space-x-3 mt-4">
                                    <Link
                                        to="/dashboard"
                                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 text-sm hover:bg-gray-50 transition-colors flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                        </svg>
                                        Back
                                    </Link>
                                    <button
                                        className="px-5 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 01.8 1.6L14.25 8l2.55 3.4A1 1 0 0116 13H6a1 1 0 00-1 1v3a1 1 0 11-2 0V6z" clipRule="evenodd" />
                                        </svg>
                                        Notes
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content - Left Side */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Navigation Tabs */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="border-b border-gray-100">
                                <div className="flex overflow-x-auto no-scrollbar">
                                    <button
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                                            activeSection === 'overview'
                                            ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                            : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                        } transition-colors duration-200`}
                                        onClick={() => setActiveSection('overview')}
                                    >
                                        Overview
                                    </button>
                                    <button
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                                            activeSection === 'content'
                                            ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                            : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                        } transition-colors duration-200`}
                                        onClick={() => setActiveSection('content')}
                                    >
                                        Course Content
                                    </button>
                                    <button
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                                            activeSection === 'discussion'
                                            ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                            : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                        } transition-colors duration-200`}
                                        onClick={() => setActiveSection('discussion')}
                                    >
                                        Discussion
                                    </button>
                                    <button
                                        className={`px-6 py-4 text-sm font-medium whitespace-nowrap focus:outline-none ${
                                            activeSection === 'notes'
                                            ? 'text-[#6C63FF] border-b-2 border-[#6C63FF] bg-indigo-50'
                                            : 'text-[#6B7280] hover:text-[#111827] hover:border-gray-200 hover:border-b-2'
                                        } transition-colors duration-200`}
                                        onClick={() => setActiveSection('notes')}
                                    >
                                        Notes
                                    </button>
                                </div>
                            </div>

                            {/* Content Sections */}
                            <div className="p-6">
                                {activeSection === 'overview' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">About This Course</h3>
                                        <div className="prose max-w-none text-gray-600">
                                            <p className="whitespace-pre-line">{course.description}</p>
                                        </div>
                                        
                                        <div className="mt-8">
                                            <h3 className="text-lg font-semibold text-gray-900 mb-4">What You'll Learn</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {/* For demonstration - these would come from API in a real app */}
                                                {[
                                                    "Understand key trading concepts and terminology",
                                                    "Analyze market trends and make informed decisions",
                                                    "Develop effective risk management strategies",
                                                    "Build your own trading plan tailored to your goals",
                                                    "Identify profitable trading opportunities",
                                                    "Master various technical analysis techniques"
                                                ].map((item, index) => (
                                                    <div key={index} className="flex items-start">
                                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#00C49A] mt-0.5 mr-2 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                                        </svg>
                                                        <p className="text-gray-600">{item}</p>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'content' && (
                                    <div>
                                        {course.content && course.content.length > 0 ? (
                                            <div>
                                                <div className="flex justify-between items-center mb-6">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Content ({currentContentIndex + 1}/{course.content.length})
                                                    </h3>
                                                    <div className="flex items-center space-x-2">
                                                        <button
                                                            onClick={() => handleContentNav('prev')}
                                                            disabled={currentContentIndex === 0}
                                                            className={`p-2 rounded-full ${
                                                                currentContentIndex === 0 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                        <button
                                                            onClick={() => handleContentNav('next')}
                                                            disabled={currentContentIndex === course.content.length - 1}
                                                            className={`p-2 rounded-full ${
                                                                currentContentIndex === course.content.length - 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </div>
                                                
                                                <motion.div
                                                    key={currentContentIndex}
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    exit={{ opacity: 0, y: -20 }}
                                                    transition={{ duration: 0.3 }}
                                                >
                                                    {renderContent(course.content[currentContentIndex])}
                                                    
                                                    <div className="mt-6 flex justify-between">
                                                        <button
                                                            onClick={() => handleContentNav('prev')}
                                                            disabled={currentContentIndex === 0}
                                                            className={`px-4 py-2 rounded-lg flex items-center ${
                                                                currentContentIndex === 0 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M9.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L7.414 9H15a1 1 0 110 2H7.414l2.293 2.293a1 1 0 010 1.414z" clipRule="evenodd" />
                                                            </svg>
                                                            Previous
                                                        </button>
                                                        
                                                        <button
                                                            onClick={handleCompleteContent}
                                                            className="px-5 py-2 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center"
                                                        >
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                            Mark as Complete
                                                        </button>
                                                        
                                                        <button
                                                            onClick={() => handleContentNav('next')}
                                                            disabled={currentContentIndex === course.content.length - 1}
                                                            className={`px-4 py-2 rounded-lg flex items-center ${
                                                                currentContentIndex === course.content.length - 1 
                                                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                            }`}
                                                        >
                                                            Next
                                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                                <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                            </svg>
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            </div>
                                        ) : (
                                            <div className="text-center py-10">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                </svg>
                                                <h3 className="mt-4 text-lg font-medium text-gray-900">No Content Available</h3>
                                                <p className="mt-1 text-sm text-gray-500">The course content will be available soon.</p>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {activeSection === 'discussion' && (
                                    <div className="text-center py-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Discussion Forum</h3>
                                        <p className="mt-1 text-sm text-gray-500">Connect with fellow learners and discuss course materials.</p>
                                        <button className="mt-4 px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-lg hover:bg-indigo-600">
                                            Start a Discussion
                                        </button>
                                    </div>
                                )}

                                {activeSection === 'notes' && (
                                    <div className="text-center py-10">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                        </svg>
                                        <h3 className="mt-4 text-lg font-medium text-gray-900">Your Notes</h3>
                                        <p className="mt-1 text-sm text-gray-500">Take notes while learning to enhance your understanding.</p>
                                        <button className="mt-4 px-4 py-2 bg-[#6C63FF] text-white text-sm rounded-lg hover:bg-indigo-600">
                                            Add New Note
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar - Right Side */}
                    <div className="space-y-8">
                        {/* Course Content Sidebar */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Course Content</h3>
                            </div>
                            <div className="p-2 max-h-[500px] overflow-y-auto">
                                {course.content && course.content.length > 0 ? (
                                    <div className="space-y-1">
                                        {course.content.map((item, index) => (
                                            <button
                                                key={index}
                                                onClick={() => {
                                                    setCurrentContentIndex(index);
                                                    setActiveSection('content');
                                                }}
                                                className={`w-full text-left px-4 py-3 rounded-lg flex items-center ${
                                                    currentContentIndex === index && activeSection === 'content'
                                                    ? 'bg-indigo-50 text-[#6C63FF]'
                                                    : 'hover:bg-gray-50'
                                                }`}
                                            >
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mr-3 ${
                                                    currentContentIndex === index && activeSection === 'content'
                                                    ? 'bg-[#6C63FF] text-white'
                                                    : 'bg-gray-100 text-gray-500'
                                                }`}>
                                                    {index + 1}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-medium">
                                                        {item.type ? item.type.charAt(0).toUpperCase() + item.type.slice(1) : 'Content'} {index + 1}
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {item.type === 'video' ? '10:35 min' : 
                                                         item.type === 'document' ? 'PDF Document' :
                                                         item.type === 'image' ? 'Image Resource' :
                                                         item.type === 'audio' ? '05:22 min' : 'Learning Resource'}
                                                    </p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-sm text-gray-500">No content available.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* About Instructor */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">About the Instructor</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center">
                                    {instructor.profilePicture ? (
                                        <img 
                                            src={instructor.profilePicture} 
                                            alt={instructor.name} 
                                            className="h-14 w-14 rounded-full border-2 border-white shadow-sm object-cover"
                                        />
                                    ) : (
                                        <div className="h-14 w-14 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white text-lg font-semibold shadow-sm">
                                            {instructor.name.charAt(0) || "I"}
                                        </div>
                                    )}
                                    <div className="ml-4">
                                        <h4 className="font-medium text-gray-900">{instructor.name}</h4>
                                        <p className="text-sm text-gray-500">{instructor.expertise}</p>
                                    </div>
                                </div>
                                
                                <div className="mt-5 space-y-4">
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#00C49A] text-white flex items-center justify-center mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-sm">Professional Trader</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#00C49A] text-white flex items-center justify-center mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-sm">10+ Years Experience</p>
                                    </div>
                                    <div className="flex items-center">
                                        <div className="w-5 h-5 rounded-full bg-[#00C49A] text-white flex items-center justify-center mr-2">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <p className="text-sm">500+ Students Taught</p>
                                    </div>
                                </div>
                                
                                <button className="mt-6 w-full py-2.5 bg-gray-50 hover:bg-gray-100 text-[#111827] rounded-xl transition-colors duration-200 text-sm font-medium flex items-center justify-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                    </svg>
                                    View Full Profile
                                </button>
                            </div>
                        </div>
                        
                        {/* Resources */}
                        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100">
                            <div className="border-b border-gray-100 px-6 py-4">
                                <h3 className="font-semibold text-gray-900">Resources</h3>
                            </div>
                            <div className="p-6">
                                <div className="space-y-4">
                                    <div className="flex items-center p-3 bg-indigo-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-[#6C63FF]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Course Syllabus</p>
                                            <p className="text-xs text-[#6C63FF]">PDF, 2.3 MB</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center p-3 bg-blue-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Trading Templates</p>
                                            <p className="text-xs text-blue-600">ZIP, 5.7 MB</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex items-center p-3 bg-green-50 rounded-lg">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                        <div className="ml-3">
                                            <p className="text-sm font-medium text-gray-900">Market Cheat Sheet</p>
                                            <p className="text-xs text-green-600">PDF, 1.5 MB</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            
            <footer className="bg-[#111827] text-gray-300 py-12">
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
