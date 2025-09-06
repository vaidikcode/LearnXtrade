import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = ({ user }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isScrolled, setIsScrolled] = useState(false);

    const location = useLocation();
    const notificationsRef = useRef(null);
    const profileRef = useRef(null);
    const searchRef = useRef(null);

    // Sample notifications - replace with actual data in a real app
    const notifications = [
        { id: 1, title: "New Course Available", message: "Python Advanced: Building Web Applications", time: "2 hours ago", read: false },
        { id: 2, title: "Learning Streak!", message: "You've maintained a 7-day learning streak 🔥", time: "1 day ago", read: false },
        { id: 3, title: "Achievement Unlocked", message: "You've earned the 'Fast Learner' badge", time: "3 days ago", read: true }
    ];

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Handle clicks outside dropdowns
    useEffect(() => {
        function handleClickOutside(event) {
            if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
                setIsNotificationsOpen(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target)) {
                setIsProfileOpen(false);
            }
            if (searchRef.current && !searchRef.current.contains(event.target) && !event.target.closest('.search-button')) {
                setIsSearchOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    // Animation variants
    const navbarVariants = {
        initial: { opacity: 0, y: -20 },
        animate: { opacity: 1, y: 0, transition: { duration: 0.3 } }
    };

    const mobileMenuVariants = {
        closed: { opacity: 0, height: 0, transition: { duration: 0.3 } },
        open: { opacity: 1, height: 'auto', transition: { duration: 0.3 } }
    };

    const navLinks = [
        { name: 'Courses', path: '/courses' },
        { name: 'Categories', path: '/categories' },
        { name: 'Educators', path: '/educators' },
        { name: 'Pricing', path: '/pricing' }
    ];

    // Function to determine if a nav link is active
    const isActive = (path) => {
        if (path === '/') return location.pathname === '/';
        return location.pathname.startsWith(path);
    };

    return (
        <motion.header
            className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-white shadow-sm'
                }`}
            initial="initial"
            animate="animate"
            variants={navbarVariants}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link to="/" className="flex items-center">
                            <span className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                                LearnXtrade
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center space-x-1">
                        {/* Search Button - Desktop */}
                        <div className="relative mr-2" ref={searchRef}>
                            <button
                                onClick={() => setIsSearchOpen(!isSearchOpen)}
                                className="search-button p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Search"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                </svg>
                            </button>

                            <AnimatePresence>
                                {isSearchOpen && (
                                    <motion.div
                                        className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-lg p-2 z-20 border border-gray-200"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#6C63FF]/20 focus-within:border-[#6C63FF]">
                                            <input
                                                type="text"
                                                placeholder="Search courses, topics..."
                                                className="w-full py-2 px-3 rounded-lg border-0 focus:outline-none text-sm"
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                autoFocus
                                            />
                                            <button className="p-2 text-[#6B7280]">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                                </svg>
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex space-x-1">
                            {navLinks.map((link) => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                        ? 'text-[#6C63FF] bg-indigo-50'
                                        : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
                                        }`}
                                >
                                    {link.name}
                                </Link>
                            ))}
                        </nav>

                        {/* Notifications */}
                        {user && (
                            <div className="relative ml-2" ref={notificationsRef}>
                                <button
                                    onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                                    className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-full transition-colors relative"
                                    aria-label="Notifications"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                    </svg>
                                    {notifications.filter(n => !n.read).length > 0 && (
                                        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                    )}
                                </button>

                                <AnimatePresence>
                                    {isNotificationsOpen && (
                                        <motion.div
                                            className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg py-2 z-20 border border-gray-200"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <h3 className="font-medium text-[#111827]">Notifications</h3>
                                            </div>
                                            <div className="max-h-96 overflow-y-auto">
                                                {notifications.length > 0 ? (
                                                    notifications.map(notification => (
                                                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50/50' : ''}`}>
                                                            <div className="flex justify-between items-start">
                                                                <h4 className="text-sm font-medium text-[#111827]">{notification.title}</h4>
                                                                <span className="text-xs text-[#6B7280]">{notification.time}</span>
                                                            </div>
                                                            <p className="text-xs text-[#6B7280] mt-1">{notification.message}</p>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <div className="px-4 py-6 text-center">
                                                        <p className="text-sm text-[#6B7280]">No notifications yet</p>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                                <button className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium">
                                                    View all notifications
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        )}

                        {/* User Menu or Login/Signup */}
                        {user ? (
                            <div className="relative ml-2" ref={profileRef}>
                                <button
                                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                                    className="flex items-center focus:outline-none"
                                >
                                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-md">
                                        {user.name.charAt(0)}
                                    </div>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 text-[#6B7280]" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                <AnimatePresence>
                                    {isProfileOpen && (
                                        <motion.div
                                            className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg py-2 z-20 border border-gray-200"
                                            initial={{ opacity: 0, y: -10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-medium text-[#111827]">{user.name}</p>
                                                <p className="text-xs text-[#6B7280]">{user.email}</p>
                                            </div>
                                            <Link to="/dashboard" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Dashboard</Link>
                                            <Link to="/profile" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Your Profile</Link>
                                            <Link to="/settings" className="block px-4 py-2 text-sm text-[#111827] hover:bg-indigo-50 hover:text-[#6C63FF]">Settings</Link>
                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Link to="/logout" className="block px-4 py-2 text-sm text-[#111827] hover:bg-red-50 hover:text-[#EF4444]">Sign out</Link>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-3">
                                <Link to="/login" className="text-[#6C63FF] hover:text-indigo-800 text-sm font-medium px-3 py-2">
                                    Log in
                                </Link>
                                <Link
                                    to="/signup"
                                    className="bg-gradient-to-r from-[#6C63FF] to-[#5046E5] text-white text-sm font-medium px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                                >
                                    Sign up
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center space-x-4">
                        {/* Search Button - Mobile */}
                        <button
                            className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-full transition-colors"
                            onClick={() => setIsSearchOpen(!isSearchOpen)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                            </svg>
                        </button>

                        {/* Notifications - Mobile */}
                        {user && (
                            <button
                                className="p-2 text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 rounded-full transition-colors relative"
                                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
                                </svg>
                                {notifications.filter(n => !n.read).length > 0 && (
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                )}
                            </button>
                        )}

                        {/* Menu Button */}
                        <button
                            className="text-[#6B7280] hover:text-[#111827] hover:bg-gray-100 p-2 rounded-full transition-colors"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            {isMenuOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Panel */}
                <AnimatePresence>
                    {isSearchOpen && (
                        <motion.div
                            className="block md:hidden p-4 border-t border-gray-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-[#6C63FF]/20 focus-within:border-[#6C63FF]">
                                <input
                                    type="text"
                                    placeholder="Search courses, topics..."
                                    className="w-full py-2 px-3 rounded-lg border-0 focus:outline-none text-sm"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    autoFocus
                                />
                                <button className="p-2 text-[#6B7280]">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Menu */}
                <AnimatePresence>
                    {isMenuOpen && (
                        <motion.div
                            className="md:hidden py-2 border-t border-gray-100"
                            initial="closed"
                            animate="open"
                            exit="closed"
                            variants={mobileMenuVariants}
                        >
                            <nav className="flex flex-col space-y-1 px-2 py-2">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.name}
                                        to={link.path}
                                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isActive(link.path)
                                            ? 'text-[#6C63FF] bg-indigo-50'
                                            : 'text-[#6B7280] hover:text-[#111827] hover:bg-gray-50'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                ))}
                            </nav>

                            {user ? (
                                <>
                                    <div className="px-4 py-2 border-t border-gray-100 mt-2">
                                        <div className="flex items-center py-2">
                                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-[#6C63FF] to-[#5046E5] flex items-center justify-center text-white font-semibold shadow-sm">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-sm font-medium text-[#111827]">{user.name}</p>
                                                <p className="text-xs text-[#6B7280]">{user.email}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-1 px-2 py-2">
                                        <Link to="/dashboard" className="px-4 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-50">Dashboard</Link>
                                        <Link to="/profile" className="px-4 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-50">Your Profile</Link>
                                        <Link to="/settings" className="px-4 py-2 rounded-lg text-sm text-[#6B7280] hover:text-[#111827] hover:bg-gray-50">Settings</Link>
                                        <Link to="/logout" className="px-4 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50">Sign out</Link>
                                    </div>
                                </>
                            ) : (
                                <div className="px-2 py-4 border-t border-gray-100 mt-2 space-y-3">
                                    <Link to="/login" className="block w-full py-2 px-4 text-center text-[#6C63FF] bg-indigo-50 hover:bg-indigo-100 rounded-lg text-sm font-medium">
                                        Log in
                                    </Link>
                                    <Link to="/signup" className="block w-full py-2 px-4 text-center bg-[#6C63FF] text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors">
                                        Sign up
                                    </Link>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Mobile Notifications Panel */}
                <AnimatePresence>
                    {isNotificationsOpen && (
                        <motion.div
                            className="md:hidden py-2 border-t border-gray-100"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="px-4 py-2">
                                <h3 className="font-medium text-[#111827]">Notifications</h3>
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`px-4 py-3 hover:bg-gray-50 ${!notification.read ? 'bg-indigo-50/50' : ''}`}>
                                            <div className="flex justify-between items-start">
                                                <h4 className="text-sm font-medium text-[#111827]">{notification.title}</h4>
                                                <span className="text-xs text-[#6B7280]">{notification.time}</span>
                                            </div>
                                            <p className="text-xs text-[#6B7280] mt-1">{notification.message}</p>
                                        </div>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center">
                                        <p className="text-sm text-[#6B7280]">No notifications yet</p>
                                    </div>
                                )}
                            </div>
                            <div className="px-4 py-2 border-t border-gray-100 text-center">
                                <button className="text-sm text-[#6C63FF] hover:text-indigo-800 font-medium">
                                    View all notifications
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.header>
    );
};

export default Navbar;
