import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";

// Configure axios defaults with environment variable
axios.defaults.baseURL = import.meta.env.VITE_SERVER_URL || 'http://localhost:3000/api'; 
axios.defaults.withCredentials = true; // Allow cookies to be sent with requests

const initialState = {
    email: "",
    password: "",
    userType: "student" // Default to student login
};

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    


    const validate = () => {
        const errs = {};
        if (!form.email.trim()) errs.email = "Email is required";
        if (!form.password) errs.password = "Password is required";
        return errs;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: undefined });
    };

    // Add state for API error messages
    const [apiError, setApiError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        // Clear any previous API errors
        setApiError("");
        setIsLoading(true);
        
        try {
            // Determine API endpoint based on user type
            const endpoint = form.userType === "teacher" 
                ? "/teacher/login" 
                : "/student/login";
                
            // Send login request to the appropriate API endpoint
            const response = await axios.post(endpoint, {
                email: form.email,
                password: form.password
            });
            
            // Handle successful login
            console.log("Login successful:", response.data);
            
            // No need to store tokens in localStorage as backend handles auth via HTTP-only cookies
            
            // Redirect based on user type
            if (form.userType === "teacher") {
                navigate('/teacher-dashboard');
            } else {
                navigate('/dashboard'); // Student dashboard
            }
        } catch (error) {
            console.error("Login error:", error);
            // Handle error responses
            if (error.response) {
                // The server responded with an error status
                setApiError(error.response.data.message || "Invalid credentials. Please try again.");
            } else if (error.request) {
                // The request was made but no response was received
                setApiError("Network error. Please check your connection and try again.");
            } else {
                // Something happened in setting up the request
                setApiError("An error occurred. Please try again.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex">
            {/* Left side (Form) */}
            <div className="flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
                <div className="w-full max-w-md space-y-8">
                    <div className="text-center">
                        <Link to="/" className="inline-block">
                            <span className="text-2xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                                LearnXtrade
                            </span>
                        </Link>
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">
                                Welcome back
                            </h2>
                            <p className="mt-2 text-sm text-gray-600">
                                Log in to your LearnXtrade account as a {form.userType === "teacher" ? "teacher" : "student"}
                            </p>
                        </motion.div>
                    </div>

                    <motion.div
                        className="bg-white py-8 px-6 shadow-xl rounded-xl border border-gray-100"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                    >
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* User Type Selection */}
                            <div>
                                <label htmlFor="userType" className="block text-sm font-medium text-gray-700 mb-1">
                                    I am a
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, userType: "student" })}
                                        className={`flex items-center justify-center py-3 px-4 rounded-lg border ${
                                            form.userType === "student" 
                                                ? "bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]" 
                                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                                        } transition-colors`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${form.userType === "student" ? "text-[#6C63FF]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        Student
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setForm({ ...form, userType: "teacher" })}
                                        className={`flex items-center justify-center py-3 px-4 rounded-lg border ${
                                            form.userType === "teacher" 
                                                ? "bg-[#6C63FF]/10 border-[#6C63FF] text-[#6C63FF]" 
                                                : "border-gray-300 hover:border-gray-400 text-gray-700"
                                        } transition-colors`}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 mr-2 ${form.userType === "teacher" ? "text-[#6C63FF]" : "text-gray-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9.5a2.5 2.5 0 00-2.5-2.5H15M9 11l3 3m0 0l3-3m-3 3V8" />
                                        </svg>
                                        Teacher
                                    </button>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                                    Email address
                                </label>
                                <div className="relative">
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-4 py-3 pl-10 rounded-lg border ${errors.email ? "border-red-500" : "border-gray-300"
                                            } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                        placeholder="you@example.com"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                </div>
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                )}
                            </div>

                            <div>
                                <div className="flex items-center justify-between mb-1">
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                        Password
                                    </label>
                                    <div className="text-sm">
                                        <Link to="/forgot-password" className="text-[#6C63FF] hover:text-[#5046E5] transition-colors">
                                            Forgot your password?
                                        </Link>
                                    </div>
                                </div>
                                <div className="relative">
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        autoComplete="current-password"
                                        value={form.password}
                                        onChange={handleChange}
                                        className={`appearance-none block w-full px-4 py-3 pl-10 rounded-lg border ${errors.password ? "border-red-500" : "border-gray-300"
                                            } shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                        placeholder="••••••••"
                                    />
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    <button
                                        type="button"
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                            </svg>
                                        ) : (
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 hover:text-gray-600" viewBox="0 0 20 20" fill="currentColor">
                                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                            </svg>
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]/20 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            {/* API Error Message Display */}
                            {apiError && (
                                <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                            </svg>
                                        </div>
                                        <div className="ml-3">
                                            <p className="text-sm text-red-700">{apiError}</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div>
                                <motion.button
                                    type="submit"
                                    disabled={isLoading}
                                    className={`w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-[#6C63FF] to-[#5046E5] hover:from-[#5046E5] hover:to-[#4338CA] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#6C63FF] ${isLoading ? "opacity-70 cursor-not-allowed" : ""
                                        }`}
                                    whileHover={{ scale: isLoading ? 1 : 1.02 }}
                                    whileTap={{ scale: isLoading ? 1 : 0.98 }}
                                >
                                    {isLoading ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            <span>Signing in...</span>
                                        </>
                                    ) : (
                                        <>
                                            <span>Sign in</span>
                                        </>
                                    )}
                                </motion.button>
                            </div>
                        </form>

                        <div className="mt-8">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-white text-gray-500">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <motion.button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                                        <path d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z" />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </motion.button>

                                <motion.button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                    whileHover={{ y: -2, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                    </svg>
                                </motion.button>
                            </div>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex justify-center text-sm"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                    >
                        <p className="text-gray-600">
                            Don't have an account?{" "}
                            <Link to="/signup" className="font-medium text-[#6C63FF] hover:text-[#5046E5]">
                                Sign up
                            </Link>
                        </p>
                    </motion.div>
                </div>
            </div>

            {/* Right side (Image/Illustration) - Hidden on mobile */}
            <div className="hidden lg:block lg:w-1/2 bg-gradient-to-r from-[#6C63FF] to-[#5046E5]">
                <div className="h-full flex items-center justify-center p-12">
                    <motion.div
                        className="max-w-md text-white"
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                    >
                        <div className="relative w-full h-64 mb-8">
                            <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-lg transform -rotate-6"></div>
                            <img
                                src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                alt="Learning illustration"
                                className="relative rounded-lg shadow-xl object-cover w-full h-full"
                            />
                        </div>
                        <h2 className="text-3xl font-bold mb-6">Continue your learning journey</h2>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Access to all your courses and learning materials</span>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Track your progress and pick up where you left off</span>
                            </div>
                            <div className="flex items-start">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span>Connect with instructors and fellow learners</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
