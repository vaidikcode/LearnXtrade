import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export default function Signup() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        accountType: 'student', // Default to student
        agreeToTerms: false
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [step, setStep] = useState(1);

    const handleChange = (e) => {
        const { name, value, checked, type } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value
        });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Basic validation
        if (!formData.fullName.trim()) newErrors.fullName = "Name is required";

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = "Email is invalid";
        }

        if (!formData.password) {
            newErrors.password = "Password is required";
        } else if (formData.password.length < 8) {
            newErrors.password = "Password must be at least 8 characters";
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        if (!formData.agreeToTerms) {
            newErrors.agreeToTerms = "You must agree to the terms and conditions";
        }

        return newErrors;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const validationErrors = validateForm();

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }

        setIsSubmitting(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Form submitted:", formData);
            setIsSubmitting(false);
            navigate('/dashboard'); // Redirect to dashboard after successful signup
        }, 1500);
    };

    const nextStep = () => {
        const validationErrors = {};

        if (step === 1) {
            if (!formData.fullName.trim()) validationErrors.fullName = "Name is required";
            if (!formData.email.trim()) {
                validationErrors.email = "Email is required";
            } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
                validationErrors.email = "Email is invalid";
            }

            if (Object.keys(validationErrors).length > 0) {
                setErrors(validationErrors);
                return;
            }
        }

        setStep(step + 1);
    };

    const prevStep = () => {
        setStep(step - 1);
    };

    const progressPercentage = (step / 3) * 100;

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            {/* Header */}
            <header className="bg-white shadow-sm py-4">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link to="/" className="text-xl font-bold bg-gradient-to-r from-[#6C63FF] to-[#8A84FF] bg-clip-text text-transparent">
                        LearnXtrade
                    </Link>
                </div>
            </header>

            <div className="flex-1 flex flex-col md:flex-row">
                {/* Left Column - Form */}
                <div className="w-full md:w-1/2 p-4 md:p-8 lg:p-12 flex items-center justify-center">
                    <motion.div
                        className="w-full max-w-md"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold text-[#111827]">Create your account</h1>
                            <p className="text-[#6B7280] mt-2">Join our community of learners and start your journey</p>
                        </div>

                        {/* Progress Bar */}
                        <div className="mb-8">
                            <div className="h-1 w-full bg-gray-200 rounded-full overflow-hidden">
                                <motion.div
                                    className="h-full bg-[#6C63FF]"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${progressPercentage}%` }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-[#6B7280] mt-2">
                                <span className={step >= 1 ? "text-[#6C63FF] font-medium" : ""}>Account</span>
                                <span className={step >= 2 ? "text-[#6C63FF] font-medium" : ""}>Security</span>
                                <span className={step >= 3 ? "text-[#6C63FF] font-medium" : ""}>Preferences</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit}>
                            {step === 1 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <label htmlFor="accountType" className="block text-sm font-medium text-[#111827] mb-2">I want to join as</label>
                                        <div className="grid grid-cols-2 gap-4">
                                            <button
                                                type="button"
                                                className={`py-3 px-4 border ${formData.accountType === 'student'
                                                    ? 'border-[#6C63FF] bg-indigo-50 text-[#6C63FF]'
                                                    : 'border-gray-300 text-[#6B7280]'} 
                          rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors`}
                                                onClick={() => setFormData({ ...formData, accountType: 'student' })}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                                                </svg>
                                                Student
                                            </button>
                                            <button
                                                type="button"
                                                className={`py-3 px-4 border ${formData.accountType === 'educator'
                                                    ? 'border-[#6C63FF] bg-indigo-50 text-[#6C63FF]'
                                                    : 'border-gray-300 text-[#6B7280]'}
                          rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors`}
                                                onClick={() => setFormData({ ...formData, accountType: 'educator' })}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                                                    <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                                                </svg>
                                                Educator
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="fullName" className="block text-sm font-medium text-[#111827] mb-2">Full Name</label>
                                        <input
                                            type="text"
                                            id="fullName"
                                            name="fullName"
                                            value={formData.fullName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                            placeholder="John Doe"
                                        />
                                        {errors.fullName && <p className="mt-1 text-red-500 text-xs">{errors.fullName}</p>}
                                    </div>

                                    <div className="mb-6">
                                        <label htmlFor="email" className="block text-sm font-medium text-[#111827] mb-2">Email Address</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                            placeholder="johndoe@example.com"
                                        />
                                        {errors.email && <p className="mt-1 text-red-500 text-xs">{errors.email}</p>}
                                    </div>

                                    <div className="flex justify-end">
                                        <motion.button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center font-medium"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Continue
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 2 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <label htmlFor="password" className="block text-sm font-medium text-[#111827] mb-2">Password</label>
                                        <div className="relative">
                                            <input
                                                type={passwordVisible ? "text" : "password"}
                                                id="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                className={`w-full px-4 py-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                                placeholder="••••••••"
                                            />
                                            <button
                                                type="button"
                                                className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                                                onClick={() => setPasswordVisible(!passwordVisible)}
                                            >
                                                {passwordVisible ? (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                                                        <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                                                    </svg>
                                                ) : (
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                                                    </svg>
                                                )}
                                            </button>
                                        </div>
                                        {errors.password && <p className="mt-1 text-red-500 text-xs">{errors.password}</p>}
                                        {formData.password && !errors.password && (
                                            <div className="mt-2">
                                                <div className="flex space-x-1">
                                                    <div className={`h-1 flex-1 rounded-full ${formData.password.length >= 8 ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`h-1 flex-1 rounded-full ${/[A-Z]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`h-1 flex-1 rounded-full ${/[0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                    <div className={`h-1 flex-1 rounded-full ${/[^A-Za-z0-9]/.test(formData.password) ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                                                </div>
                                                <div className="mt-2 text-xs text-[#6B7280] flex flex-wrap gap-2">
                                                    <span className={formData.password.length >= 8 ? 'text-green-500' : ''}>8+ characters</span>
                                                    <span className={/[A-Z]/.test(formData.password) ? 'text-green-500' : ''}>Uppercase</span>
                                                    <span className={/[0-9]/.test(formData.password) ? 'text-green-500' : ''}>Number</span>
                                                    <span className={/[^A-Za-z0-9]/.test(formData.password) ? 'text-green-500' : ''}>Special character</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mb-8">
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#111827] mb-2">Confirm Password</label>
                                        <input
                                            type={passwordVisible ? "text" : "password"}
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 rounded-lg border ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-[#6C63FF]/20 focus:border-[#6C63FF]`}
                                            placeholder="••••••••"
                                        />
                                        {errors.confirmPassword && <p className="mt-1 text-red-500 text-xs">{errors.confirmPassword}</p>}
                                    </div>

                                    <div className="flex justify-between">
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </motion.button>
                                        <motion.button
                                            type="button"
                                            onClick={nextStep}
                                            className="px-6 py-3 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center font-medium"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Continue
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                                            </svg>
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}

                            {step === 3 && (
                                <motion.div
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    <div className="mb-6">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="agreeToTerms"
                                                checked={formData.agreeToTerms}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]/20 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-[#6B7280]">
                                                I agree to the <Link to="#" className="text-[#6C63FF] hover:underline">Terms of Service</Link> and <Link to="#" className="text-[#6C63FF] hover:underline">Privacy Policy</Link>
                                            </span>
                                        </label>
                                        {errors.agreeToTerms && <p className="mt-1 text-red-500 text-xs">{errors.agreeToTerms}</p>}
                                    </div>

                                    <div className="mb-10">
                                        <label className="flex items-center">
                                            <input
                                                type="checkbox"
                                                name="marketingEmails"
                                                checked={formData.marketingEmails}
                                                onChange={handleChange}
                                                className="h-4 w-4 text-[#6C63FF] focus:ring-[#6C63FF]/20 border-gray-300 rounded"
                                            />
                                            <span className="ml-2 text-sm text-[#6B7280]">
                                                Send me useful emails about new features and learning opportunities (optional)
                                            </span>
                                        </label>
                                    </div>

                                    <div className="flex justify-between">
                                        <motion.button
                                            type="button"
                                            onClick={prevStep}
                                            className="px-6 py-3 border border-gray-300 text-[#111827] rounded-lg hover:bg-gray-50 transition-colors flex items-center font-medium"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Back
                                        </motion.button>
                                        <motion.button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className={`px-6 py-3 bg-[#6C63FF] text-white rounded-lg hover:bg-indigo-700 transition-colors shadow-sm flex items-center font-medium ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
                                            whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
                                            whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
                                        >
                                            {isSubmitting ? (
                                                <>
                                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                    </svg>
                                                    Creating Account...
                                                </>
                                            ) : (
                                                <>
                                                    Create Account
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                                                        <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                                                    </svg>
                                                </>
                                            )}
                                        </motion.button>
                                    </div>
                                </motion.div>
                            )}
                        </form>

                        <div className="mt-10 pt-6 border-t border-gray-200 text-center">
                            <p className="text-sm text-[#6B7280]">
                                Already have an account? <Link to="/login" className="text-[#6C63FF] font-medium hover:underline">Log in</Link>
                            </p>
                        </div>

                        <div className="mt-6">
                            <div className="relative">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-gray-200"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-2 bg-[#F9FAFB] text-[#6B7280]">Or continue with</span>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-3 gap-3">
                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                                    </svg>
                                </button>

                                <button
                                    type="button"
                                    className="w-full inline-flex justify-center py-2.5 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                                >
                                    <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M10 0C4.475 0 0 4.475 0 10c0 5.525 4.475 10 10 10 5.525 0 10-4.475 10-10 0-5.525-4.475-10-10-10zm6.24 4.56c2.44 2.44 3.11 6.09 1.73 9.18-.12.23-.36.29-.59.17-.08-.04-2.74-1.57-2.74-1.57l-1.57 2.74c-.12.23-.39.29-.63.17-2.45-1.17-4.26-3.34-4.93-6.1H4.08c-.26 0-.45-.23-.41-.49.17-1.09.55-2.11 1.14-3.03-1.13 1.01-2.56 3.38-2.56 3.38-.14.23-.45.29-.67.14-2.1-1.35-3.11-3.86-2.54-6.39.04-.21.23-.35.44-.35h3.17c.24 0 .45.14.54.36 1.17 2.71 3.89 4.61 7.05 4.61 1.8 0 3.47-.61 4.8-1.64.19-.14.45-.12.63.06z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Right Column - Illustration */}
                <div className="hidden md:block md:w-1/2 bg-gradient-to-r from-[#6C63FF] to-[#5046E5]">
                    <div className="h-full flex items-center justify-center p-8">
                        <motion.div
                            className="max-w-md text-white"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="relative w-full h-72 mb-8">
                                <div className="absolute top-0 left-0 w-full h-full bg-white/10 rounded-lg transform -rotate-6"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                                    alt="People learning together"
                                    className="relative rounded-lg shadow-xl object-cover w-full h-full"
                                />
                            </div>
                            <h2 className="text-3xl font-bold mb-4">Join thousands of learners worldwide</h2>
                            <ul className="space-y-4">
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Access to over 200 premium courses across various domains</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Learn at your own pace with personalized learning paths</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Connect with expert instructors and a supportive community</span>
                                </li>
                                <li className="flex items-start">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 flex-shrink-0 text-indigo-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Earn certificates and badges to showcase your achievements</span>
                                </li>
                            </ul>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
}
