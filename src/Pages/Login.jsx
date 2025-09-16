import React, { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, Moon, Sun } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        // Clear error when user starts typing
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: '' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement login logic here
        console.log('Login submitted:', formData);
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic here
        console.log('Google login clicked');
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-12 px-4 sm:px-6 lg:px-8 transition-all duration-300'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'></div>

            <div className='max-w-md w-full space-y-8 relative z-10'>
                {/* Theme toggle button */}

                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
                        Welcome back
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400'>
                        Sign in to your account to continue
                    </p>
                </div>

                {/* Form card */}
                <div className='bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700/50 p-8'>
                    <div className='space-y-6'>
                        {/* Email field */}
                        <div className='space-y-2'>
                            {/* <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Email address
                            </label> */}
                            <div className='relative group'>
                                <Mail
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type='email'
                                    name='email'
                                    required
                                    className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                    placeholder='Enter your email'
                                    value={formData.email}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>

                        {/* Password field */}
                        <div className='space-y-2'>
                            {/* <label className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                Password
                            </label> */}
                            <div className='relative group'>
                                <Lock
                                    className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                    size={20}
                                />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    name='password'
                                    required
                                    className='w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                    placeholder='Enter your password'
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
                        </div>

                        {/* Sign in button */}
                        <button
                            type='submit'
                            onClick={handleSubmit}
                            className='w-full bg-gradient-to-r from-gray-400 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200'
                        >
                            Sign in
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

                        {/* Google login */}
                        <button
                            type='button'
                            onClick={handleGoogleLogin}
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
                            Continue with Google
                        </button>
                    </div>

                    {/* Sign up link */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Don't have an account?{' '}
                            <a
                                href='#'
                                className='font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200'
                            >
                                Sign up
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
