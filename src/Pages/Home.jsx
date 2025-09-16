import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { features, testimonials } from '../constants/homeData';
import pic from '../assets/QA.png';

export default function Home() {
    return (
        <div className='bg-blue-50 dark:bg-gray-900 min-h-screen transition-colors duration-200'>
            {/* Hero Section */}
            <section className='max-w-7xl mx-auto px-4 py-20'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
                    <div className='flex-1 space-y-6'>
                        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white'>
                            Challenge Your Mind,
                            <br />
                            <span className='text-yellow-400'>
                                Quiz Your Way
                            </span>{' '}
                            to Excellence
                        </h1>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            Join thousands of quiz enthusiasts in creating,
                            sharing, and participating in engaging quizzes
                            across various topics.
                        </p>
                        <div className='flex gap-4'>
                            <Link
                                to='/create-quiz'
                                className='px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-gray-900 rounded-lg font-semibold flex items-center gap-2'
                            >
                                Create Quiz <ArrowRight size={20} />
                            </Link>
                            <Link
                                to='/ai-quiz'
                                className='px-6 py-3 border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-gray-900 rounded-lg font-semibold transition-colors'
                            >
                                Participate
                            </Link>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <img
                            src={pic}
                            className='w-full max-w-md mx-auto rounded-3xl shadow-lg'
                        />
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className='bg-white dark:bg-gray-800 py-20 transition-colors duration-200'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
                        Why Choose Quiz Arena?
                    </h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className='text-center p-6 rounded-lg bg-blue-50 dark:bg-gray-700'
                                >
                                    <div className='flex justify-center mb-4'>
                                        <IconComponent className='w-12 h-12 text-yellow-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-300'>
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className='py-20'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
                        What Our Users Say
                    </h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className='p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg'
                            >
                                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                                    {testimonial.text}
                                </p>
                                <div>
                                    <p className='font-semibold text-gray-900 dark:text-white'>
                                        {testimonial.author}
                                    </p>
                                    <p className='text-sm text-yellow-400'>
                                        {testimonial.role}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
