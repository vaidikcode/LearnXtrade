import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const initialState = {
    email: "",
    password: "",
};

export default function Login() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isAnimated, setIsAnimated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsAnimated(true), 100);
    }, []);

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

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validate();
        if (Object.keys(validationErrors).length) {
            setErrors(validationErrors);
            return;
        }

        // Simulate login process
        setIsLoading(true);
        setTimeout(() => {
            console.log("Login attempt with:", form);
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4 py-10">
            <div
                className={`w-full max-w-md transition-all duration-700 ease-out 
                    ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-6">
                        <h2 className="text-2xl font-bold text-white text-center">Welcome Back</h2>
                        <p className="text-blue-100 text-center mt-1 text-sm">Log in to your LearnXtrade account</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div
                                className={`space-y-5 transition-all duration-500 delay-300 ease-out
                                    ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            >
                                <div className="transition-all duration-300 hover:translate-y-[-2px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <div className="relative">
                                        <input
                                            type="email"
                                            name="email"
                                            value={form.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.email ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10`}
                                            autoComplete="email"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                                            <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                                        </svg>
                                    </div>
                                    {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email}</p>}
                                </div>

                                <div className="transition-all duration-300 hover:translate-y-[-2px]">
                                    <div className="flex justify-between items-center mb-1">
                                        <label className="block text-sm font-medium text-gray-700">Password</label>
                                        <Link to="/forgot-password" className="text-xs text-blue-600 hover:text-blue-800">
                                            Forgot Password?
                                        </Link>
                                    </div>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10`}
                                            autoComplete="current-password"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className={`w-full py-2.5 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-md 
                                  hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] 
                                  font-semibold flex items-center justify-center ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}
                                  ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                                  transition-all duration-500 delay-700 ease-out`}
                            >
                                {isLoading ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Logging in...</span>
                                    </>
                                ) : (
                                    <>
                                        <span>Log In</span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M3 3a1 1 0 011 1v12a1 1 0 11-2 0V4a1 1 0 011-1zm7.707 3.293a1 1 0 010 1.414L9.414 9H17a1 1 0 110 2H9.414l1.293 1.293a1 1 0 01-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </form>

                        <div
                            className={`mt-6 text-center transition-all duration-500 delay-900 ease-out
                                ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <span className="text-gray-600 text-sm">
                                Don't have an account?{" "}
                                <Link to="/signup" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                                    Sign Up
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className={`text-center mt-4 text-gray-500 text-xs transition-all duration-500 delay-1000 ease-out
                        ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
                >
                    <p>© {new Date().getFullYear()} LearnXtrade. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}