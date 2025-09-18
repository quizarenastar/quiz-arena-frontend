import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';

const NotFound = () => {
    return (
        <div className='min-h-[80vh] flex items-center justify-center px-4 py-12 bg-white dark:bg-gray-900 transition-colors duration-200'>
            <div className='text-center'>
                {/* 404 Number */}
                <h1 className='text-9xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 text-transparent bg-clip-text animate-gradient bg-300'>
                    404
                </h1>

                {/* Message */}
                <h2 className='mt-4 text-3xl font-semibold text-gray-800 dark:text-gray-200'>
                    Page Not Found
                </h2>
                <p className='mt-4 text-gray-600 dark:text-gray-400 max-w-md mx-auto'>
                    Oops! It seems like the page you're looking for doesn't
                    exist or has been moved.
                </p>

                {/* Action Buttons */}
                <div className='mt-8 flex flex-col sm:flex-row gap-4 justify-center'>
                    <Link
                        to='/'
                        className='inline-flex items-center px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl'
                    >
                        <Home className='w-5 h-5 mr-2' />
                        Go Home
                    </Link>
                    <button
                        onClick={() => window.history.back()}
                        className='inline-flex items-center px-6 py-3 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-200 shadow-md hover:shadow-lg'
                    >
                        <ArrowLeft className='w-5 h-5 mr-2' />
                        Go Back
                    </button>
                </div>

                {/* Decorative Elements */}
                <div className='mt-12'>
                    <div className='flex justify-center space-x-2'>
                        <div
                            className='w-2 h-2 rounded-full bg-blue-500 animate-bounce'
                            style={{ animationDelay: '0ms' }}
                        ></div>
                        <div
                            className='w-2 h-2 rounded-full bg-purple-500 animate-bounce'
                            style={{ animationDelay: '150ms' }}
                        ></div>
                        <div
                            className='w-2 h-2 rounded-full bg-pink-500 animate-bounce'
                            style={{ animationDelay: '300ms' }}
                        ></div>
                    </div>
                    <p className='mt-4 text-sm text-gray-500 dark:text-gray-400'>
                        Contact the administrator if you think this is a mistake
                    </p>
                </div>
            </div>

            {/* Add custom styles for animations */}
            <style jsx>{`
                @keyframes gradient {
                    0% {
                        background-position: 0% 50%;
                    }
                    50% {
                        background-position: 100% 50%;
                    }
                    100% {
                        background-position: 0% 50%;
                    }
                }
                .animate-gradient {
                    animation: gradient 3s ease infinite;
                    background-size: 300% 300%;
                }
                .bg-300 {
                    background-size: 300% 300%;
                }
            `}</style>
        </div>
    );
};

export default NotFound;
