import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

export default function Home() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [activeCategory, setActiveCategory] = useState('All');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [stats, setStats] = useState({ students: 0, courses: 0, instructors: 0 });
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const notificationsRef = useRef(null);

    // Handle clicks outside the notifications panel
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animation variants
    const fadeIn = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2
            }
        }
    };

    // Intersection observer hooks for animations
    const [statsRef, statsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    // Update stats when in view
    useEffect(() => {
        if (statsInView) {
            setStats({
                students: 32500,
                courses: 278,
                instructors: 142
            });
        }
    }, [statsInView]);

    // Course data with broader subject areas
    const courses = [
        {
            id: 1,
            title: "Python Programming Fundamentals",
            educator: "Alex Johnson",
            category: "Programming",
            description: "Master Python basics and build your first applications from scratch.",
            rating: 4.8,
            students: 4258,
            image: "https://images.unsplash.com/photo-1526379095098-d400fd0bf935?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["beginner", "programming", "technology"]
        },
        {
            id: 2,
            title: "UI/UX Design Principles",
            educator: "Emily Zhang",
            category: "Design",
            description: "Learn to create beautiful user interfaces that engage and convert.",
            rating: 4.9,
            students: 3127,
            image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["design", "creative", "intermediate"]
        },
        {
            id: 3,
            title: "Financial Literacy Essentials",
            educator: "Robert Taylor",
            category: "Finance",
            description: "Build a strong foundation in personal finance and investment basics.",
            rating: 4.7,
            students: 2854,
            image: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["finance", "beginner", "personal-development"]
        },
        {
            id: 4,
            title: "Data Science for Beginners",
            educator: "Sarah Williams",
            category: "Data Science",
            description: "Start your journey into data analysis, visualization and machine learning.",
            rating: 4.6,
            students: 3542,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["data", "technology", "beginner"]
        },
        {
            id: 5,
            title: "Digital Marketing Masterclass",
            educator: "Michael Chen",
            category: "Marketing",
            description: "Learn proven strategies to grow your brand online and drive conversions.",
            rating: 4.8,
            students: 2975,
            image: "https://images.unsplash.com/photo-1557838923-2985c318be48?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["marketing", "business", "intermediate"]
        },
        {
            id: 6,
            title: "Creative Writing Workshop",
            educator: "James Wilson",
            category: "Writing",
            description: "Develop your storytelling skills and find your unique creative voice.",
            rating: 4.7,
            students: 1896,
            image: "https://images.unsplash.com/photo-1455390582262-044cdead277a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
            tags: ["writing", "creative", "beginner"]
        }
    ];

    // Categories
    const categories = [
        { id: 1, name: "All", icon: "🔍" },
        { id: 2, name: "Programming", icon: "💻" },
        { id: 3, name: "Design", icon: "🎨" },
        { id: 4, name: "Finance", icon: "💰" },
        { id: 5, name: "Marketing", icon: "📊" },
        { id: 6, name: "Data Science", icon: "📈" },
        { id: 7, name: "Writing", icon: "✏️" }
    ];

    // Badges for gamification
    const popularBadges = [
        { id: 1, name: "Fast Learner", icon: "🚀", achievers: 1243 },
        { id: 2, name: "Perfect Attendance", icon: "📅", achievers: 865 },
        { id: 3, name: "Knowledge Guru", icon: "🧠", achievers: 579 },
        { id: 4, name: "Problem Solver", icon: "🔍", achievers: 721 }
    ];

    // Leaderboard
    const leaderboard = [
        { id: 1, name: "Alex Johnson", points: 3850, courses: 12, avatar: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Maria Garcia", points: 3720, courses: 10, avatar: "https://randomuser.me/api/portraits/women/28.jpg" },
        { id: 3, name: "Jamal Wilson", points: 3645, courses: 11, avatar: "https://randomuser.me/api/portraits/men/55.jpg" }
    ];

    // Notifications
    const notifications = [
        { id: 1, title: "New Course Available", message: "Python Advanced: Building Web Applications", time: "2 hours ago", read: false },
        { id: 2, title: "Learning Streak!", message: "You've maintained a 7-day learning streak 🔥", time: "1 day ago", read: false },
        { id: 3, title: "Achievement Unlocked", message: "You've earned the 'Fast Learner' badge", time: "3 days ago", read: true }
    ];

    // Helper function to render stars based on rating
    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-[#F59E0B]' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-[#6B7280]">{rating}</span>
            </div>
        );
    };

    // Filter courses by category
    const filteredCourses = activeCategory === 'All'
        ? courses
        : courses.filter(course => course.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#F9FAFB]">
            {/* Navigation */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                                    LearnXtrade
                                </span>
                            </motion.div>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <motion.div className="flex space-x-6" variants={staggerContainer} initial="hidden" animate="visible">
                                {['Courses', 'Categories', 'Educators', 'Pricing'].map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={`#${item.toLowerCase()}`}
                                        className="text-[#6B7280] hover:text-[#111827] transition-colors"
                                        variants={fadeIn}
                                        whileHover={{ y: -2 }}
                                    >
                                        {item}
                                    </motion.a>
                                ))}

                                <div className="relative" ref={notificationsRef}>
                                    <motion.button
                                        variants={fadeIn}
                                        className="text-[#6B7280] hover:text-[#111827] p-2 rounded-full hover:bg-gray-100 transition-colors relative"
                                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                        </svg>
                                        {notifications.filter(n => !n.read).length > 0 && (
                                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                        )}
                                    </motion.button>

                                    {isNotificationsOpen && (
                                        <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-20 ring-1 ring-[#6C63FF]/10">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="font-medium text-[#111827]">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.map(notification => (
                                                    <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50/50' : ''}`}>
                                                        <div className="flex justify-between items-start">
                                                            <h4 className="text-sm font-medium text-[#111827]">{notification.title}</h4>
                                                            <span className="text-xs text-[#6B7280]">{notification.time}</span>
                                                        </div>
                                                        <p className="text-xs text-[#6B7280] mt-1">{notification.message}</p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                                <button className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium">
                                                    View all notifications
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <motion.div variants={fadeIn}>
                                    <Link to="/login" className="text-[#6C63FF] hover:text-indigo-800 font-medium">Log in</Link>
                                </motion.div>

                                <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }}>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="md:hidden">
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile menu */}
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden py-3 space-y-2"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {['Courses', 'Categories', 'Educators', 'Pricing'].map((item, index) => (
                                <a
                                    key={index}
                                    href={`#${item.toLowerCase()}`}
                                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="pt-2 flex flex-col space-y-2">
                                <Link to="/login" className="block py-2 px-4 text-[#6C63FF] hover:bg-indigo-50 rounded-md">
                                    Log in
                                </Link>
                                <Link to="/signup" className="block py-2 px-4 bg-[#6C63FF] text-white rounded-md">
                                    Sign up
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </header>

            {/* Hero Section with Search */}
            <section className="relative overflow-hidden bg-white border-b border-gray-100">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-20">
                    <div className="flex flex-col md:flex-row items-center">
                        <motion.div
                            className="md:w-1/2 md:pr-12"
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, ease: "easeOut" }}
                        >
                            <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-[#111827] mb-4">
                                Discover your potential with <span className="bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">LearnXtrade</span>
                            </h1>
                            <p className="text-[#6B7280] text-lg mb-8 md:max-w-lg">
                                Explore courses taught by expert instructors across various disciplines. Learn at your own pace and track your progress.
                            </p>

                            {/* Search bar */}
                            <div className={`relative mb-8 transition-all duration-300 ${isSearchFocused ? 'scale-105' : ''}`}>
                                <input
                                    type="text"
                                    placeholder="Search for any skill, course or educator..."
                                    className="w-full px-5 py-4 pr-12 rounded-xl border border-gray-200 focus:border-[#6C63FF] focus:ring-2 focus:ring-[#6C63FF]/20 shadow-sm transition-all duration-300"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-4">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Start Learning
                                    </Link>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                    <Link
                                        to="/educator-signup"
                                        className="bg-white text-[#6C63FF] border border-[#6C63FF] px-6 py-3 rounded-lg font-medium hover:bg-indigo-50 transition-all duration-300"
                                    >
                                        Become an Educator
                                    </Link>
                                </motion.div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="md:w-1/2 mt-12 md:mt-0"
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                        >
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="absolute -top-4 -left-4 w-full h-full bg-[#6C63FF]/10 rounded-xl transform -rotate-6"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                    alt="Online learning illustration"
                                    className="relative rounded-xl shadow-2xl transform rotate-3 hover:rotate-0 transition-transform duration-500"
                                />
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Stats Counter Section */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6"
                        ref={statsRef}
                        initial="hidden"
                        animate={statsInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                    >
                        <motion.div className="flex flex-col items-center py-8 px-4 rounded-xl bg-gradient-to-r from-[#6C63FF]/5 to-[#8A84FF]/5" variants={fadeIn}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent mb-2">
                                {statsInView && <CountUp end={stats.students} duration={2.5} separator="," />}+
                            </div>
                            <span className="text-[#6B7280]">Active Learners</span>
                        </motion.div>

                        <motion.div className="flex flex-col items-center py-8 px-4 rounded-xl bg-gradient-to-r from-[#00C49A]/5 to-teal-500/5" variants={fadeIn}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-[#00C49A] to-teal-500 bg-clip-text text-transparent mb-2">
                                {statsInView && <CountUp end={stats.courses} duration={2.5} />}+
                            </div>
                            <span className="text-[#6B7280]">Quality Courses</span>
                        </motion.div>

                        <motion.div className="flex flex-col items-center py-8 px-4 rounded-xl bg-gradient-to-r from-[#F59E0B]/5 to-amber-500/5" variants={fadeIn}>
                            <div className="text-5xl font-bold bg-gradient-to-r from-[#F59E0B] to-amber-500 bg-clip-text text-transparent mb-2">
                                {statsInView && <CountUp end={stats.instructors} duration={2.5} />}+
                            </div>
                            <span className="text-[#6B7280]">Expert Instructors</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Categories Filter Section */}
            <section id="categories" className="py-12 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="mb-10"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-[#111827] mb-2">Explore Categories</h2>
                        <p className="text-[#6B7280] max-w-2xl">
                            Browse our wide range of courses and find exactly what you're looking for
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-10"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {categories.map(category => (
                            <motion.button
                                key={category.id}
                                variants={fadeIn}
                                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center shadow-sm
                  ${activeCategory === category.name ? 'bg-[#6C63FF] text-white' : 'bg-white text-[#6B7280] hover:bg-gray-50'}`}
                                onClick={() => setActiveCategory(category.name)}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </motion.button>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Course Cards Section */}
            <section id="courses" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <motion.h2
                            className="text-3xl font-bold text-[#111827]"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Popular Courses
                        </motion.h2>
                        <motion.a
                            href="#viewall"
                            className="text-[#6C63FF] hover:text-indigo-800 font-medium flex items-center"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                            whileHover={{ x: 5 }}
                        >
                            View All
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </motion.a>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredCourses.map(course => (
                            <motion.div
                                key={course.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                                        <motion.button
                                            className="bg-[#6C63FF] text-white py-2 rounded-lg transform translate-y-4 opacity-0 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Enroll Now
                                        </motion.button>
                                    </div>
                                </div>
                                <div className="p-5">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-3 py-1 bg-[#6C63FF]/10 text-[#6C63FF] text-xs font-bold rounded-full">
                                            {course.category}
                                        </span>
                                        {renderStars(course.rating)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-[#111827] mb-2 group-hover:text-[#6C63FF] transition-colors">{course.title}</h3>
                                    <p className="text-sm text-[#6B7280] mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center">
                                            <img
                                                src={`https://randomuser.me/api/portraits/${course.id % 2 ? 'men' : 'women'}/${20 + course.id}.jpg`}
                                                alt={course.educator}
                                                className="h-8 w-8 rounded-full mr-2 border-2 border-white shadow-sm"
                                            />
                                            <div>
                                                <p className="text-xs text-[#6B7280]">Instructor</p>
                                                <p className="text-sm font-medium text-[#111827]">{course.educator}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xs text-[#6B7280]">Students</p>
                                            <p className="text-sm font-medium text-[#111827]">{course.students.toLocaleString()}</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {filteredCourses.length === 0 && (
                        <div className="text-center py-12">
                            <div className="text-5xl mb-4">🔍</div>
                            <h3 className="text-xl font-medium text-[#111827] mb-2">No courses found</h3>
                            <p className="text-[#6B7280]">Try selecting a different category</p>
                        </div>
                    )}

                    {activeCategory !== 'All' && filteredCourses.length > 0 && (
                        <div className="text-center mt-10">
                            <motion.button
                                className="px-6 py-3 border border-[#6C63FF] text-[#6C63FF] rounded-lg hover:bg-indigo-50 transition-colors font-medium"
                                onClick={() => setActiveCategory('All')}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View All Courses
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>

            {/* Gamification Section */}
            <section className="py-16 bg-[#F9FAFB]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row gap-8">
                        {/* Badges */}
                        <motion.div
                            className="md:w-1/2"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-white rounded-xl shadow-md p-6 h-full">
                                <h3 className="text-xl font-bold text-[#111827] mb-6">Popular Badges</h3>
                                <div className="grid grid-cols-2 gap-6">
                                    {popularBadges.map(badge => (
                                        <div key={badge.id} className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-[#6C63FF]/20 hover:bg-[#6C63FF]/5 transition-colors group">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#F59E0B] to-amber-500 flex items-center justify-center text-2xl mr-4 shadow-md transform transition-transform duration-300 group-hover:scale-110">
                                                {badge.icon}
                                            </div>
                                            <div>
                                                <h4 className="font-medium text-[#111827] group-hover:text-[#6C63FF] transition-colors">{badge.name}</h4>
                                                <p className="text-xs text-[#6B7280]">{badge.achievers.toLocaleString()} achievers</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </motion.div>

                        {/* Leaderboard */}
                        <motion.div
                            className="md:w-1/2"
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="bg-white rounded-xl shadow-md p-6 h-full">
                                <h3 className="text-xl font-bold text-[#111827] mb-6">Leaderboard</h3>
                                <div className="space-y-4">
                                    {leaderboard.map((user, index) => (
                                        <div key={user.id} className="flex items-center p-4 rounded-lg border border-gray-100 hover:border-[#6C63FF]/20 hover:bg-[#6C63FF]/5 transition-colors">
                                            <div className="font-bold text-2xl text-[#6B7280] mr-4 w-6 text-center">{index + 1}</div>
                                            <img src={user.avatar} alt={user.name} className="w-10 h-10 rounded-full mr-4" />
                                            <div className="flex-1">
                                                <h4 className="font-medium text-[#111827]">{user.name}</h4>
                                                <p className="text-xs text-[#6B7280]">{user.courses} courses completed</p>
                                            </div>
                                            <div className="bg-[#6C63FF]/10 text-[#6C63FF] font-medium text-sm py-1 px-3 rounded-full">
                                                {user.points.toLocaleString()} pts
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="text-[#6C63FF] hover:text-indigo-800 font-medium text-sm">
                                        View Full Leaderboard
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Become an Educator CTA */}
            <section className="py-16 bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -mb-40 -ml-20"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row items-center">
                        <div className="md:w-2/3 mb-8 md:mb-0">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            >
                                <h2 className="text-3xl md:text-4xl font-bold mb-4">Share your knowledge with the world</h2>
                                <p className="text-indigo-100 max-w-2xl mb-8">
                                    Join our community of educators and help others learn valuable skills. Create courses, connect with learners, and earn credits for your expertise.
                                </p>
                                <motion.div
                                    className="inline-block"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <Link
                                        to="/educator-signup"
                                        className="inline-block bg-white text-[#6C63FF] px-8 py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                    >
                                        Become an Educator
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>
                        <div className="md:w-1/3">
                            <motion.img
                                src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80"
                                alt="Teaching illustration"
                                className="rounded-xl shadow-2xl"
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.5 }}
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Footer */}
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

            {/* Custom styling for line clamp */}
            <style jsx>{`
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}

