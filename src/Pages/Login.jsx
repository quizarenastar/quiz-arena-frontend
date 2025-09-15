import React, { useState } from 'react';
import { Mail, Lock, Github } from 'lucide-react';

export default function Login() {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement login logic here
    };

    const handleGoogleLogin = () => {
        // Implement Google login logic here
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8'>
            <div className='max-w-md w-full space-y-8'>
                <div>
                    <h2 className='mt-6 text-center text-3xl font-extrabold text-gray-900'>
                        Sign in to your account
                    </h2>
                </div>
                <form className='mt-8 space-y-6' onSubmit={handleSubmit}>
                    <div className='rounded-md shadow-sm space-y-4'>
                        <div className='relative'>
                            <Mail
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='email'
                                name='email'
                                required
                                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Email address'
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                        <div className='relative'>
                            <Lock
                                className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400'
                                size={20}
                            />
                            <input
                                type='password'
                                name='password'
                                required
                                className='w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                placeholder='Password'
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div>
                        <button
                            type='submit'
                            className='group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
                        >
                            Sign in
                        </button>
                    </div>

                    <div className='relative'>
                        <div className='absolute inset-0 flex items-center'>
                            <div className='w-full border-t border-gray-300'></div>
                        </div>
                        <div className='relative flex justify-center text-sm'>
                            <span className='px-2 bg-gray-50 text-gray-500'>
                                Or continue with
                            </span>
                        </div>
                    </div>

                    <button
                        type='button'
                        onClick={handleGoogleLogin}
                        className='w-full flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50'
                    >
                        <img
                            className='h-5 w-5 mr-2'
                            src='https://www.svgrepo.com/show/475656/google-color.svg'
                            alt='Google logo'
                        />
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
}
