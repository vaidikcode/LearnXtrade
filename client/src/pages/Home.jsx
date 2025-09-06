import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination, Navigation, EffectCoverflow } from 'swiper/modules';
import { useInView } from 'react-intersection-observer';
import CountUp from 'react-countup';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import 'swiper/css/effect-coverflow';

export default function Home() {
    const [activeCategory, setActiveCategory] = useState(null);
    const [stats, setStats] = useState({ students: 0, courses: 0, instructors: 0 });
    const [isNavOpen, setIsNavOpen] = useState(false);

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

    const scaleIn = {
        hidden: { scale: 0.8, opacity: 0 },
        visible: {
            scale: 1,
            opacity: 1,
            transition: { duration: 0.5 }
        }
    };

    // Intersection observer hooks for animations
    const [featuresRef, featuresInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [statsRef, statsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    const [testimonialsRef, testimonialsInView] = useInView({
        triggerOnce: true,
        threshold: 0.1
    });

    // Update stats when in view
    useEffect(() => {
        if (statsInView) {
            setStats({
                students: 15000,
                courses: 120,
                instructors: 85
            });
        }
    }, [statsInView]);

    // Sample course data
    const courses = [
        {
            id: 1,
            title: "Introduction to Stock Trading",
            educator: "Sarah Williams",
            category: "Finance",
            description: "Learn the fundamentals of stock markets and develop trading strategies.",
            rating: 4.8,
            students: 1243,
            image: "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 2,
            title: "Cryptocurrency Fundamentals",
            educator: "Michael Chen",
            category: "Blockchain",
            description: "Understand blockchain technology and the cryptocurrency ecosystem.",
            rating: 4.6,
            students: 982,
            image: "https://images.unsplash.com/photo-1516245834210-c4c142787335?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 3,
            title: "Technical Analysis Masterclass",
            educator: "Robert Taylor",
            category: "Finance",
            description: "Master chart patterns and indicators for successful trading.",
            rating: 4.9,
            students: 756,
            image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 4,
            title: "Investment Portfolio Management",
            educator: "David Wilson",
            category: "Finance",
            description: "Learn to build and manage a diversified investment portfolio.",
            rating: 4.7,
            students: 534,
            image: "https://images.unsplash.com/photo-1579225663317-c0505f91d60d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 5,
            title: "Algorithmic Trading Basics",
            educator: "Emma Davis",
            category: "Technology",
            description: "Get started with automated trading strategies and algorithms.",
            rating: 4.5,
            students: 412,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        },
        {
            id: 6,
            title: "Risk Management in Trading",
            educator: "Jennifer Lopez",
            category: "Finance",
            description: "Learn essential risk management techniques to protect your capital.",
            rating: 4.8,
            students: 328,
            image: "https://images.unsplash.com/photo-1535320903710-d993d3d77d29?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
        }
    ];

    // Categories
    const categories = [
        { id: 1, name: "Finance", icon: "💰" },
        { id: 2, name: "Technology", icon: "💻" },
        { id: 3, name: "Blockchain", icon: "🔗" },
        { id: 4, name: "Economics", icon: "📊" },
        { id: 5, name: "Business", icon: "📈" },
        { id: 6, name: "Personal Finance", icon: "💵" },
        { id: 7, name: "Wealth Management", icon: "🏦" }
    ];

    // Features
    const features = [
        {
            id: 1,
            title: "Credits Wallet",
            description: "Earn and spend credits on premium courses, consulting sessions, and more",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            )
        },
        {
            id: 2,
            title: "Trust Score System",
            description: "Build your reputation through consistent learning and positive contributions",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
            )
        },
        {
            id: 3,
            title: "Badges & Gamification",
            description: "Earn achievement badges and track progress to stay motivated",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z" />
                </svg>
            )
        },
        {
            id: 4,
            title: "Peer-to-Peer Consulting",
            description: "Connect with experienced traders for personalized guidance",
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
            )
        }
    ];

    // Testimonials
    const testimonials = [
        {
            id: 1,
            name: "Alex Johnson",
            role: "Student",
            image: "https://randomuser.me/api/portraits/men/32.jpg",
            text: "LearnXtrade helped me understand trading in a way traditional courses couldn't. The trust score system motivated me to stay consistent!"
        },
        {
            id: 2,
            name: "Maria Garcia",
            role: "Consultant",
            image: "https://randomuser.me/api/portraits/women/28.jpg",
            text: "Being a consultant on LearnXtrade has been rewarding. I help others while building my profile and earning credits."
        },
        {
            id: 3,
            name: "Jamal Wilson",
            role: "Student",
            image: "https://randomuser.me/api/portraits/men/55.jpg",
            text: "The gamification elements make learning finance actually enjoyable. I find myself excited to earn the next badge!"
        }
    ];

    // Helper function to render stars based on rating
    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                    <svg
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
                <span className="ml-1 text-sm text-gray-600">{rating}</span>
            </div>
        );
    };

    // Helper function to filter courses by category
    const filterCoursesByCategory = (categoryName) => {
        if (!categoryName) return courses;
        return courses.filter(course => course.category === categoryName);
    };

    // Get trending courses (here just using the first 4 for demo)
    const trendingCourses = courses.slice(0, 4);

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
            {/* Navigation with animation */}
            <header className="bg-white shadow-sm sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.5 }}
                            >
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                                    LearnXtrade
                                </span>
                            </motion.div>
                        </div>

                        <div className="hidden md:flex items-center space-x-6">
                            <motion.div className="flex space-x-6" variants={staggerContainer} initial="hidden" animate="visible">
                                {['Courses', 'Features', 'Testimonials', 'Pricing'].map((item, index) => (
                                    <motion.a
                                        key={index}
                                        href={`#${item.toLowerCase()}`}
                                        className="text-gray-600 hover:text-gray-900 transition-colors"
                                        variants={fadeIn}
                                        whileHover={{ y: -2 }}
                                    >
                                        {item}
                                    </motion.a>
                                ))}

                                <motion.div variants={fadeIn}>
                                    <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium">Log in</Link>
                                </motion.div>

                                <motion.div variants={fadeIn} whileHover={{ scale: 1.05 }}>
                                    <Link
                                        to="/signup"
                                        className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2 rounded-md shadow-sm hover:shadow-md transition-all duration-300"
                                    >
                                        Sign up
                                    </Link>
                                </motion.div>
                            </motion.div>
                        </div>

                        <div className="md:hidden">
                            <button
                                className="text-gray-500 hover:text-gray-700"
                                onClick={() => setIsNavOpen(!isNavOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile nav menu */}
                    {isNavOpen && (
                        <motion.div
                            className="md:hidden py-3 space-y-2"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                        >
                            {['Courses', 'Features', 'Testimonials', 'Pricing'].map((item, index) => (
                                <a
                                    key={index}
                                    href={`#${item.toLowerCase()}`}
                                    className="block py-2 px-4 text-gray-600 hover:bg-gray-50 rounded-md"
                                    onClick={() => setIsNavOpen(false)}
                                >
                                    {item}
                                </a>
                            ))}
                            <div className="pt-2 flex flex-col space-y-2">
                                <Link to="/login" className="block py-2 px-4 text-blue-600 hover:bg-blue-50 rounded-md">
                                    Log in
                                </Link>
                                <Link to="/signup" className="block py-2 px-4 bg-blue-600 text-white rounded-md">
                                    Sign up
                                </Link>
                            </div>
                        </motion.div>
                    )}
                </div>
            </header>

            {/* Hero Section with Animation */}
            <section className="relative overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 -z-10">
                    <div className="absolute top-20 right-[10%] w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
                    <div className="absolute top-40 left-[15%] w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
                    <div className="absolute bottom-20 right-[20%] w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20 md:py-28">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row items-center">
                            <motion.div
                                className="md:w-1/2 md:pr-12"
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.8, ease: "easeOut" }}
                            >
                                <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                                    Learn. Trade. <span className="text-yellow-300">Grow.</span>
                                </h1>
                                <p className="text-blue-100 text-lg mb-8 md:max-w-lg">
                                    Unlock your trading potential with interactive courses designed by experts. Join our vibrant community and transform your financial future.
                                </p>
                                <div className="flex flex-wrap gap-4">
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                        <Link
                                            to="/signup"
                                            className="bg-white text-blue-600 px-6 py-3 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                                        >
                                            Get Started Free
                                        </Link>
                                    </motion.div>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
                                        <a
                                            href="#courses"
                                            className="bg-blue-700 bg-opacity-60 backdrop-blur-sm text-white border border-blue-400 border-opacity-30 px-6 py-3 rounded-lg font-medium shadow-md hover:bg-opacity-80 transition-all duration-300"
                                        >
                                            Explore Courses
                                        </a>
                                    </motion.div>
                                </div>

                                <div className="flex items-center mt-10 text-sm text-blue-100">
                                    <div className="flex -space-x-2 mr-3">
                                        {[1, 2, 3, 4].map(i => (
                                            <img
                                                key={i}
                                                src={`https://randomuser.me/api/portraits/${i % 2 ? 'men' : 'women'}/${20 + i}.jpg`}
                                                alt="User"
                                                className="h-8 w-8 rounded-full border-2 border-blue-600"
                                            />
                                        ))}
                                    </div>
                                    <span>Join <span className="font-bold text-white">15,000+</span> learners today</span>
                                </div>
                            </motion.div>

                            <motion.div
                                className="md:w-1/2 mt-12 md:mt-0"
                                initial={{ opacity: 0, y: 50 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                            >
                                <div className="relative w-full max-w-md mx-auto">
                                    <div className="absolute -top-4 -left-4 w-full h-full bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl transform -rotate-2"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
                                        alt="Trading visualization"
                                        className="relative rounded-xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500"
                                    />
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Stats Counter Section */}
            <section className="py-12 -mt-6 relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-white rounded-xl shadow-xl p-8"
                        ref={statsRef}
                        initial="hidden"
                        animate={statsInView ? "visible" : "hidden"}
                        variants={staggerContainer}
                    >
                        <motion.div className="flex flex-col items-center" variants={scaleIn}>
                            <span className="text-4xl font-bold text-blue-600">
                                {statsInView && <CountUp end={stats.students} duration={2.5} separator="," />}+
                            </span>
                            <span className="text-gray-600 mt-1">Active Learners</span>
                        </motion.div>

                        <motion.div className="flex flex-col items-center" variants={scaleIn}>
                            <span className="text-4xl font-bold text-blue-600">
                                {statsInView && <CountUp end={stats.courses} duration={2.5} />}+
                            </span>
                            <span className="text-gray-600 mt-1">Quality Courses</span>
                        </motion.div>

                        <motion.div className="flex flex-col items-center" variants={scaleIn}>
                            <span className="text-4xl font-bold text-blue-600">
                                {statsInView && <CountUp end={stats.instructors} duration={2.5} />}+
                            </span>
                            <span className="text-gray-600 mt-1">Expert Instructors</span>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            {/* Trending Courses with Auto-Carousel */}
            <section className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center mb-10">
                        <motion.h2
                            className="text-3xl font-bold text-gray-800"
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5 }}
                        >
                            Trending Now 🔥
                        </motion.h2>
                        <motion.a
                            href="#courses"
                            className="text-blue-600 hover:text-blue-800 font-medium flex items-center"
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

                    <Swiper
                        effect={'coverflow'}
                        grabCursor={true}
                        centeredSlides={true}
                        slidesPerView={'auto'}
                        coverflowEffect={{
                            rotate: 0,
                            stretch: 0,
                            depth: 100,
                            modifier: 2.5,
                        }}
                        autoplay={{
                            delay: 3000,
                            disableOnInteraction: false,
                        }}
                        pagination={{ clickable: true }}
                        navigation={true}
                        modules={[EffectCoverflow, Pagination, Navigation, Autoplay]}
                        className="mySwiper"
                    >
                        {trendingCourses.map(course => (
                            <SwiperSlide key={course.id} className="w-80 sm:w-96">
                                <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 m-4 h-[420px] relative group">
                                    <div className="absolute top-3 right-3 bg-yellow-400 text-gray-800 px-2 py-1 rounded-full text-xs font-bold z-10">
                                        Trending
                                    </div>
                                    <div className="h-48 overflow-hidden relative">
                                        <img
                                            src={course.image}
                                            alt={course.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                                            <div className="absolute bottom-4 left-4">
                                                <span className="px-2 py-1 bg-white/90 text-blue-600 text-xs font-bold rounded-md backdrop-blur-sm">
                                                    {course.category}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-5">
                                        <div className="flex items-center justify-between mb-2">
                                            <div className="flex items-center">
                                                {renderStars(course.rating)}
                                                <span className="ml-1 text-sm text-gray-500">({course.students.toLocaleString()})</span>
                                            </div>
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                        <div className="flex items-center text-sm text-gray-500 mb-4">
                                            <img
                                                src={`https://randomuser.me/api/portraits/${course.id % 2 ? 'men' : 'women'}/${20 + course.id}.jpg`}
                                                alt={course.educator}
                                                className="h-6 w-6 rounded-full mr-2 border border-gray-200"
                                            />
                                            <span>{course.educator}</span>
                                        </div>
                                        <div className="absolute bottom-4 left-5 right-5 flex justify-between items-center">
                                            <span className="font-bold text-blue-600">50 Credits</span>
                                            <motion.button
                                                className="px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:shadow-md transition-all"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                Enroll Now
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                </div>
            </section>

            {/* Categories Section with Interaction */}
            <section className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="mb-10 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Explore Categories</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Browse our wide range of courses across different categories tailored to help you succeed in trading
                        </p>
                    </motion.div>

                    <motion.div
                        className="flex flex-wrap justify-center gap-4 mb-10"
                        variants={staggerContainer}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        <motion.button
                            variants={fadeIn}
                            className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 
                ${activeCategory === null ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                            onClick={() => setActiveCategory(null)}
                            whileHover={{ y: -2 }}
                            whileTap={{ y: 0 }}
                        >
                            All Categories
                        </motion.button>

                        {categories.map(category => (
                            <motion.button
                                key={category.id}
                                variants={fadeIn}
                                className={`px-5 py-3 rounded-full text-sm font-medium transition-all duration-300 flex items-center 
                  ${activeCategory === category.name ? 'bg-blue-600 text-white shadow-md' : 'bg-white text-gray-700 hover:bg-gray-100'}`}
                                onClick={() => setActiveCategory(activeCategory === category.name ? null : category.name)}
                                whileHover={{ y: -2 }}
                                whileTap={{ y: 0 }}
                            >
                                <span className="mr-2">{category.icon}</span>
                                {category.name}
                            </motion.button>
                        ))}
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filterCoursesByCategory(activeCategory).map(course => (
                            <motion.div
                                key={course.id}
                                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: "-50px" }}
                                transition={{ duration: 0.5 }}
                                whileHover={{ y: -5 }}
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={course.image}
                                        alt={course.title}
                                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                    />
                                </div>
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full">
                                            {course.category}
                                        </span>
                                        {renderStars(course.rating)}
                                    </div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{course.title}</h3>
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{course.description}</p>
                                    <div className="flex items-center text-sm text-gray-500 mb-4">
                                        <img
                                            src={`https://randomuser.me/api/portraits/${course.id % 2 ? 'men' : 'women'}/${20 + course.id}.jpg`}
                                            alt={course.educator}
                                            className="h-6 w-6 rounded-full mr-2 border border-gray-200"
                                        />
                                        <span>{course.educator}</span>
                                        <span className="mx-2">•</span>
                                        <span>{course.students.toLocaleString()} students</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <div className="text-blue-600 font-bold flex items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                                            </svg>
                                            50 Credits
                                        </div>
                                        <motion.button
                                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            Enroll Now
                                        </motion.button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {activeCategory && (
                        <div className="text-center mt-10">
                            <motion.button
                                className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                onClick={() => setActiveCategory(null)}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View All Courses
                            </motion.button>
                        </div>
                    )}
                </div>
            </section>

            {/* Why LearnXtrade Section with Animations */}
            <section id="features" className="py-16 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Why Choose LearnXtrade?</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Our platform offers unique features designed to enhance your learning experience and help you build valuable trading skills.
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
                        ref={featuresRef}
                        variants={staggerContainer}
                        initial="hidden"
                        animate={featuresInView ? "visible" : "hidden"}
                    >
                        {features.map(feature => (
                            <motion.div
                                key={feature.id}
                                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-all duration-300 group"
                                variants={scaleIn}
                                whileHover={{ y: -5 }}
                            >
                                <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                <p className="text-gray-600 text-sm">{feature.description}</p>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            {/* Testimonials with Carousel */}
            <section id="testimonials" className="py-16 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <motion.div
                        className="text-center mb-12"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">What Our Students Say</h2>
                        <p className="text-gray-600 max-w-2xl mx-auto">
                            Hear from our community of traders who have transformed their skills with LearnXtrade
                        </p>
                    </motion.div>

                    <motion.div
                        className="mt-12"
                        ref={testimonialsRef}
                        variants={fadeIn}
                        initial="hidden"
                        animate={testimonialsInView ? "visible" : "hidden"}
                    >
                        <Swiper
                            slidesPerView={1}
                            spaceBetween={30}
                            autoplay={{
                                delay: 4000,
                                disableOnInteraction: false,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                },
                                768: {
                                    slidesPerView: 2,
                                },
                                1024: {
                                    slidesPerView: 3,
                                },
                            }}
                            modules={[Pagination, Autoplay]}
                            className="testimonial-swiper py-10"
                        >
                            {testimonials.map(testimonial => (
                                <SwiperSlide key={testimonial.id}>
                                    <div className="bg-white rounded-xl shadow-md p-6 border border-gray-100 h-full flex flex-col">
                                        <div className="flex-1">
                                            <div className="text-yellow-400 mb-4">
                                                ★★★★★
                                            </div>
                                            <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                                        </div>
                                        <div className="flex items-center">
                                            <img
                                                src={testimonial.image}
                                                alt={testimonial.name}
                                                className="w-12 h-12 rounded-full mr-4 border-2 border-blue-100"
                                            />
                                            <div>
                                                <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                                <p className="text-sm text-gray-500">{testimonial.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </motion.div>
                </div>
            </section>

            {/* Enhanced CTA Section */}
            <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full">
                    <div className="absolute top-0 right-0 w-80 h-80 bg-white/10 rounded-full -mt-20 -mr-20"></div>
                    <div className="absolute bottom-0 left-0 w-80 h-80 bg-white/10 rounded-full -mb-40 -ml-20"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to start your trading journey?</h2>
                        <p className="text-blue-100 max-w-2xl mx-auto mb-8">
                            Join thousands of students learning and mastering trading skills on LearnXtrade. Start for free today!
                        </p>
                        <motion.div
                            className="inline-block"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <Link
                                to="/signup"
                                className="inline-block bg-white text-blue-600 px-8 py-4 rounded-lg font-medium shadow-md hover:shadow-lg transition-all duration-300"
                            >
                                Get Started for Free
                            </Link>
                        </motion.div>
                        <p className="text-blue-200 mt-4 text-sm">No credit card required • Cancel anytime</p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-gray-800 text-gray-300 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-white text-lg font-semibold mb-4">LearnXtrade</h3>
                            <p className="text-gray-400 text-sm">
                                Modern platform for learning trading skills, connecting with peers, and tracking your progress.
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

            {/* Add some custom styles for horizontal scrolling */}
            <style jsx>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        
        .hide-scrollbar {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
        
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .swiper-slide {
          width: auto;
          height: auto;
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
      `}</style>
        </div>
    );
}

