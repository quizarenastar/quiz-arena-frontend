import React, { useState, useEffect } from 'react';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    Moon,
    Sun,
    Check,
    X,
} from 'lucide-react';

export default function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [acceptTerms, setAcceptTerms] = useState(false);

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }

        // Update password strength
        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Basic validation
        const newErrors = {};
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!acceptTerms) {
            newErrors.terms = 'Please accept the terms and conditions';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        // Implement signup logic here
        console.log('Signup submitted:', formData);
    };

    const handleGoogleSignup = () => {
        // Implement Google signup logic here
        console.log('Google signup clicked');
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-yellow-500';
            case 3:
                return 'bg-blue-500';
            case 4:
            case 5:
                return 'bg-green-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
            case 5:
                return 'Strong';
            default:
                return '';
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute -top-40 -right-40 w-80 h-80 bg-green-300 dark:bg-green-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-pulse'></div>
                <div className='absolute -bottom-40 -left-40 w-80 h-80 bg-blue-300 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-70 animate-pulse delay-1000'></div>
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-purple-300 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-xl opacity-50 animate-pulse delay-500'></div>
            </div>

            <div className='max-w-md w-full space-y-8 relative z-10'>
                {/* Theme toggle button */}

                {/* Header */}
                <div className='text-center'>
                    <div className='mx-auto h-16 w-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg'>
                        <User className='w-8 h-8 text-white' />
                    </div>
                    <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Create your account
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Join us today and start your journey
                    </p>
                </div>

                {/* Form card */}
                <div className='bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700/50 p-8'>
                    <div className='space-y-6'>
                        {/* Username field */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Username
                            </label>
                            <div className='relative group'>
                                <User
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type='text'
                                    name='username'
                                    required
                                    className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                    placeholder='Choose a username'
                                    value={formData.username}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Email field */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Email address
                            </label>
                            <div className='relative group'>
                                <Mail
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type='email'
                                    name='email'
                                    required
                                    className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                    placeholder='Enter your email'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Password
                            </label>
                            <div className='relative group'>
                                <Lock
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    required
                                    className='w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-green-500 dark:focus:ring-green-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                    placeholder='Create a password'
                                    value={formData.password}
                                    onChange={handleChange}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                >
                                    {showPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>

                            {/* Password strength indicator */}
                            {formData.password && (
                                <div className='mt-2'>
                                    <div className='flex items-center justify-between mb-1'>
                                        <span className='text-xs text-gray-500 dark:text-gray-400'>
                                            Password strength
                                        </span>
                                        <span
                                            className={`text-xs font-medium ${
                                                passwordStrength >= 3
                                                    ? 'text-green-600 dark:text-green-400'
                                                    : passwordStrength >= 2
                                                    ? 'text-yellow-600 dark:text-yellow-400'
                                                    : 'text-red-600 dark:text-red-400'
                                            }`}
                                        >
                                            {getPasswordStrengthText()}
                                        </span>
                                    </div>
                                    <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                                        <div
                                            className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                            style={{
                                                width: `${
                                                    (passwordStrength / 5) * 100
                                                }%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Confirm Password field */}
                        <div className='space-y-2'>
                            <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Confirm Password
                            </label>
                            <div className='relative group'>
                                <Lock
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-green-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type={
                                        showConfirmPassword
                                            ? 'text'
                                            : 'password'
                                    }
                                    name='confirmPassword'
                                    required
                                    className={`w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border rounded-2xl focus:outline-none focus:ring-2 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200 ${
                                        errors.confirmPassword
                                            ? 'border-red-300 dark:border-red-600 focus:ring-red-500'
                                            : 'border-gray-300 dark:border-gray-600 focus:ring-green-500 dark:focus:ring-green-400'
                                    }`}
                                    placeholder='Confirm your password'
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                />
                                <button
                                    type='button'
                                    onClick={() =>
                                        setShowConfirmPassword(
                                            !showConfirmPassword
                                        )
                                    }
                                    className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff size={20} />
                                    ) : (
                                        <Eye size={20} />
                                    )}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className='text-red-500 dark:text-red-400 text-sm flex items-center'>
                                    <X size={16} className='mr-1' />
                                    {errors.confirmPassword}
                                </p>
                            )}
                        </div>

                        {/* Terms and conditions */}
                        <div className='space-y-2'>
                            <label className='flex items-start'>
                                <input
                                    type='checkbox'
                                    checked={acceptTerms}
                                    onChange={(e) =>
                                        setAcceptTerms(e.target.checked)
                                    }
                                    className='w-4 h-4 mt-0.5 text-green-600 bg-gray-100 dark:bg-gray-700 border-gray-300 dark:border-gray-600 rounded focus:ring-green-500 dark:focus:ring-green-400'
                                />
                                <span className='ml-3 text-sm text-gray-600 dark:text-gray-400'>
                                    I agree to the{' '}
                                    <a
                                        href='#'
                                        className='text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200'
                                    >
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a
                                        href='#'
                                        className='text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200'
                                    >
                                        Privacy Policy
                                    </a>
                                </span>
                            </label>
                            {errors.terms && (
                                <p className='text-red-500 dark:text-red-400 text-sm flex items-center'>
                                    <X size={16} className='mr-1' />
                                    {errors.terms}
                                </p>
                            )}
                        </div>

                        {/* Sign up button */}
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='w-full bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
                        >
                            Create Account
                        </button>

                        {/* Divider */}
                        <div className='relative'>
                            <div className='absolute inset-0 flex items-center'>
                                <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
                            </div>
                            <div className='relative flex justify-center text-sm'>
                                <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                                    Or continue with
                                </span>
                            </div>
                        </div>

                        {/* Google signup */}
                        <button
                            type='button'
                            onClick={handleGoogleSignup}
                            className='w-full flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
                        >
                            <svg className='w-5 h-5 mr-3' viewBox='0 0 24 24'>
                                <path
                                    fill='#4285F4'
                                    d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                />
                                <path
                                    fill='#34A853'
                                    d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                />
                                <path
                                    fill='#FBBC05'
                                    d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                />
                                <path
                                    fill='#EA4335'
                                    d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                />
                            </svg>
                            Sign up with Google
                        </button>
                    </div>

                    {/* Sign in link */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Already have an account?{' '}
                            <a
                                href='#'
                                className='font-medium text-green-600 dark:text-green-400 hover:text-green-500 dark:hover:text-green-300 transition-colors duration-200'
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
