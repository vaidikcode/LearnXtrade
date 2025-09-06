import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/animations.css";

const initialState = {
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
};

export default function Signup() {
    const [form, setForm] = useState(initialState);
    const [errors, setErrors] = useState({});
    const [isAnimated, setIsAnimated] = useState(false);

    useEffect(() => {
        // Trigger animation after component mounts
        setTimeout(() => setIsAnimated(true), 100);
    }, []);

    const validate = () => {
        const errs = {};
        if (!form.fullName.trim()) errs.fullName = "Full Name is required";
        if (!form.email.trim()) errs.email = "Email is required";
        if (!form.password) errs.password = "Password is required";
        if (!form.confirmPassword) errs.confirmPassword = "Confirm your password";
        if (form.password && form.confirmPassword && form.password !== form.confirmPassword)
            errs.confirmPassword = "Passwords do not match";
        if (!form.role) errs.role = "Please select a role";
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
        // Log form data (remove confirmPassword)
        const { confirmPassword, ...dataToLog } = form;
        console.log(dataToLog);
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-10 overflow-hidden">
            {/* Enhanced Dynamic Background */}
            <div className="absolute inset-0 -z-10 overflow-hidden">
                {/* Base gradient background */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-800 via-indigo-900 to-purple-900 gradient-animate"></div>

                {/* Animated geometric shapes */}
                <div className="absolute top-0 left-0 w-full h-full">
                    {/* Floating circles */}
                    <div className="absolute top-[10%] left-[15%] w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float"></div>
                    <div className="absolute top-[40%] right-[15%] w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float-reverse delay-2"></div>
                    <div className="absolute bottom-[20%] left-[30%] w-80 h-80 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 float delay-4"></div>

                    {/* Light effects */}
                    <div className="absolute top-0 left-1/4 w-1/2 h-1/2 bg-gradient-to-b from-blue-300 to-transparent opacity-10 pulse"></div>
                    <div className="absolute bottom-0 right-1/4 w-1/2 h-1/2 bg-gradient-to-t from-purple-300 to-transparent opacity-10 pulse delay-4"></div>

                    {/* Decorative elements */}
                    <svg className="absolute top-20 right-20 w-20 h-20 text-white opacity-5 float" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>
                    <svg className="absolute bottom-20 left-20 w-20 h-20 text-white opacity-5 float-reverse" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"></path>
                    </svg>

                    {/* Grid pattern overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wMSI+PHBhdGggZD0iTTM2IDM0djQwaDR2LTQwaC00em0wLTR2LTQwaDR2NDBoLTR6bS00NCA0MGg0MHY0aC00MHYtNHptMC00NHY0MGg0di00MGgtNHptMC00di00MGg0djQwaC00em00MC00NGgtNDB2NGg0MHYtNHoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-10"></div>
                </div>
            </div>

            {/* Signup Card */}
            <div
                className={`w-full max-w-md transition-all duration-700 ease-out relative z-10
                    ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}
            >
                <div className="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/20">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 py-6 px-6 relative">
                        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1zbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48cGF0aCBkPSJNMzYgMzR2NDBoNHYtNDBoLTR6bTAtNHYtNDBoNHY0MGgtNHptLTQ0IDQwaDQwdjRoLTQwdi00em0wLTQ0djQwaDR2LTQwaC00em0wLTR2LTQwaDR2NDBoLTR6bTQwLTQ0aC00MHY0aDQwdi00eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>
                        <h2 className="text-2xl font-bold text-white text-center relative z-10">Join LearnXtrade</h2>
                        <p className="text-blue-100 text-center mt-1 text-sm relative z-10">Create your account to get started</p>
                    </div>

                    <div className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div
                                className={`space-y-5 transition-all duration-500 delay-300 ease-out
                                    ${isAnimated ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-4'}`}
                            >
                                <div className="transition-all duration-300 hover:translate-y-[-2px]">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <div className="relative">
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={form.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.fullName ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10`}
                                            autoComplete="name"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {errors.fullName && <p className="text-xs text-red-500 mt-1">{errors.fullName}</p>}
                                </div>

                                <div className="transition-all duration-300 hover:translate-y-[-2px] mt-5">
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

                                <div className="transition-all duration-300 hover:translate-y-[-2px] mt-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="password"
                                            value={form.password}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.password ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10`}
                                            autoComplete="new-password"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password}</p>}
                                </div>

                                <div className="transition-all duration-300 hover:translate-y-[-2px] mt-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
                                    <div className="relative">
                                        <input
                                            type="password"
                                            name="confirmPassword"
                                            value={form.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.confirmPassword ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10`}
                                            autoComplete="new-password"
                                        />
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                    {errors.confirmPassword && <p className="text-xs text-red-500 mt-1">{errors.confirmPassword}</p>}
                                </div>

                                <div className="transition-all duration-300 hover:translate-y-[-2px] mt-5">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">I am a:</label>
                                    <div className="relative">
                                        <select
                                            name="role"
                                            value={form.role}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-2 rounded-lg border ${errors.role ? "border-red-400" : "border-gray-200"} focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 pl-10 appearance-none`}
                                        >
                                            <option value="">Select</option>
                                            <option value="student">Student</option>
                                            <option value="educator">Educator</option>
                                        </select>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-2.5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zM4.332 8.027c.76-1.406 2.177-2.399 3.641-2.726a6 6 0 00-1.49 1.972 7.96 7.96 0 00-2.151.754zm.809 1.027a8.005 8.005 0 013.359-.775 8.03 8.03 0 013.35.775 5.97 5.97 0 00-.96 1.561 4.002 4.002 0 01-2.4.87 4 4 0 01-2.39-.87 5.976 5.976 0 00-.96-1.561zm9.527-1.027a7.979 7.979 0 00-2.15-.754 5.986 5.986 0 00-1.49-1.972c1.464.327 2.88 1.32 3.64 2.726zM8 11a3 3 0 106 0 3 3 0 00-6 0z" clipRule="evenodd" />
                                        </svg>
                                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                                            </svg>
                                        </div>
                                    </div>
                                    {errors.role && <p className="text-xs text-red-500 mt-1">{errors.role}</p>}
                                </div>
                            </div>

                            <button
                                type="submit"
                                className={`w-full py-3 mt-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg shadow-lg
                                    hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-[1.02] font-semibold 
                                    flex items-center justify-center
                                    ${isAnimated ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}
                                    transition-all duration-500 delay-700 ease-out`}
                            >
                                <span>Sign Up</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>
                        </form>

                        <div
                            className={`mt-6 text-center transition-all duration-500 delay-900 ease-out
                                ${isAnimated ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
                        >
                            <span className="text-gray-600 text-sm">
                                Already have an account?{" "}
                                <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-300">
                                    Login
                                </Link>
                            </span>
                        </div>
                    </div>
                </div>

                <div
                    className={`text-center mt-4 text-white/80 text-xs transition-all duration-500 delay-1000 ease-out
                        ${isAnimated ? 'opacity-100' : 'opacity-0'}`}
                >
                    <p>© {new Date().getFullYear()} LearnXtrade. All rights reserved.</p>
                </div>
            </div>
        </div>
    );
}
