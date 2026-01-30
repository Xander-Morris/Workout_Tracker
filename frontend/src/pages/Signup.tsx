import type { FC } from 'react'
import '../index.css'
import { useAuth } from '../contexts/auth'
import { Link } from "react-router-dom";
import { useState } from "react";

const checkPasswordStrength = (password: string) => {
    const requirements = {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        lowercase: /[a-z]/.test(password),
        digit: /\d/.test(password),
        special: /[^a-zA-Z0-9]/.test(password)
    };

    return requirements;
};

const isPasswordStrong = (password: string): boolean => {
    const requirements = checkPasswordStrength(password);
    
    return Object.values(requirements).every(req => req);
};

const Signup: FC = () => {
    const { signup, isLoading, errors, setErrors, setIsLoading } = useAuth();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [passwordRequirements, setPasswordRequirements] = useState({
        length: false,
        uppercase: false,
        lowercase: false,
        digit: false,
        special: false
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        if (name === 'password') {
            setPasswordRequirements(checkPasswordStrength(value));
        }

        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: ''
            });
        }
    };

    const validateForm = () => {
        const newErrors: { [key: string]: string } = {};

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!emailRegex.test(formData.email)) {
            newErrors.email = 'Please enter a valid email address';
        }

        // Username validation
        if (!formData.username) {
            newErrors.username = "Username is required";
        } 

        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (!isPasswordStrong(formData.password)) {
            newErrors.password = 'Password does not meet strength requirements';
        }

        // Confirm password validation
        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            signup(formData);
        } catch (error) {
            console.error('Signup error:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="background-primary flex items-center justify-center">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Create your account
                    </h2>
                    <p className="text-gray-800">
                        Join Workout Tracker and start tracking your workouts
                    </p>
                </div>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <form className="space-y-2" onSubmit={handleSubmit}>
                        <div className="transform translate-y-[-6px]">
                            <label htmlFor="email" className="text-left block text-sm font-medium text-gray-700 mb-2">
                                Email address
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.email ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your email"
                            />
                            {errors.email && (
                                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>

                        <div className="transform translate-y-[-6px]">
                            <label htmlFor="username" className="text-left block text-sm font-medium text-gray-700 mb-2">
                                Username
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="username"
                                value={formData.username}
                                onChange={handleChange}
                                className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.username ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Enter your username"
                            />
                            {errors.username && (
                                <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                            )}
                        </div>

                        <div className="transform translate-y-[-6px]">
                            <label htmlFor="password" className="text-left block text-sm font-medium text-gray-700 mb-2">
                                Password
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.password ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Create a password"
                            />

                            {/* Password strength requirements */}
                            {formData.password && (
                                <div className="mt-2 space-y-1 text-xs">
                                    <div className={`flex items-center ${passwordRequirements.length ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className={`mr-2 ${passwordRequirements.length ? '✓' : '○'}`}>At least 8 characters</span>
                                    </div>
                                    <div className={`flex items-center ${passwordRequirements.uppercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className={`mr-2 ${passwordRequirements.uppercase ? '✓' : '○'}`}>One uppercase letter</span>
                                    </div>
                                    <div className={`flex items-center ${passwordRequirements.lowercase ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className={`mr-2 ${passwordRequirements.lowercase ? '✓' : '○'}`}>One lowercase letter</span>
                                    </div>
                                    <div className={`flex items-center ${passwordRequirements.digit ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className={`mr-2 ${passwordRequirements.digit ? '✓' : '○'}`}>One number</span>
                                    </div>
                                    <div className={`flex items-center ${passwordRequirements.special ? 'text-green-600' : 'text-gray-500'}`}>
                                        <span className={`mr-2 ${passwordRequirements.special ? '✓' : '○'}`}>One special character (!@#$%^&*)</span>
                                    </div>
                                </div>
                            )}

                            {errors.password && (
                                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>

                        <div className="transform translate-y-[-6px]">
                            <label htmlFor="confirmPassword" className="text-left block text-sm font-medium text-gray-700 mb-2">
                                Confirm Password
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className={`text-gray-700 w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors ${errors.confirmPassword ? 'border-red-300 bg-red-50' : 'border-gray-300'
                                    }`}
                                placeholder="Confirm your password"
                            />
                            {errors.confirmPassword && (
                                <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-medium text-white transition-colors ${isLoading
                                ? 'bg-indigo-400 cursor-not-allowed'
                                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2'
                                }`}
                        >
                            {isLoading ? (
                                <div className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </div>
                            ) : (
                                'Create account'
                            )}
                        </button>

                        <div className="text-center mt-[16px]">
                            <p className="text-sm text-gray-600">
                                Already have an account?{' '}
                                <Link
                                    to="/login"
                                    className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors"
                                >
                                    Sign in here
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>

                <div className="text-center">
                    <Link
                        to="/"
                        className="text-indigo-700 hover:text-indigo-500 text-sm font-medium transition-colors"
                    >
                        ← Back to home
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;