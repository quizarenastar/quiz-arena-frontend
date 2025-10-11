import React from 'react';
import {
    Target,
    Book,
    Heart,
    Users,
    Award,
    Lightbulb,
    Globe,
    CheckCircle,
} from 'lucide-react';

const AboutUs = () => {
    const features = [
        {
            icon: <Target className='w-8 h-8' />,
            title: 'Interactive Quizzes',
            description:
                'Engaging quizzes across various topics and difficulty levels to challenge and improve your knowledge.',
            gradient: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Book className='w-8 h-8' />,
            title: 'Learning Resources',
            description:
                'Access to comprehensive study materials and explanations to help you understand topics better.',
            gradient: 'from-purple-500 to-pink-500',
        },
    ];

    const values = [
        {
            icon: <Award className='w-6 h-6' />,
            title: 'Quality',
            description:
                'We ensure our quizzes are accurate, relevant, and up-to-date.',
            color: 'text-emerald-400',
        },
        {
            icon: <Globe className='w-6 h-6' />,
            title: 'Accessibility',
            description:
                'We strive to make our platform accessible to learners from all backgrounds.',
            color: 'text-blue-400',
        },
        {
            icon: <Lightbulb className='w-6 h-6' />,
            title: 'Innovation',
            description:
                'We continuously improve our platform with new features and learning methods.',
            color: 'text-yellow-400',
        },
        {
            icon: <Users className='w-6 h-6' />,
            title: 'Community',
            description:
                'We foster a supportive environment where learners can grow together.',
            color: 'text-purple-400',
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
            <div className='container mx-auto px-4 py-12 space-y-20'>
                {/* Mission Section */}
                <section className='max-w-4xl mx-auto'>
                    <div className='text-center mb-8 '>
                        <h1 className='text-4xl font-bold bg-gradient-to-r from-blue-800 to-gray-600 bg-clip-text text-transparent bg-clip-text  leading-tight'>
                            Our Mission
                        </h1>
                    </div>
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300'>
                        <p className='text-lg sm:text-xl text-gray-700 dark:text-gray-300 leading-relaxed text-center'>
                            Quiz Arena is dedicated to making learning fun and
                            engaging through interactive quizzes. We believe
                            that knowledge should be accessible to everyone, and
                            that learning is more effective when it's enjoyable.
                            Our platform transforms traditional learning into an
                            exciting journey of discovery and growth.
                        </p>
                    </div>
                </section>

                {/* Features Section */}
                <section>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                            What We Offer
                        </h2>
                        <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-gray-600 mx-auto mb-8'></div>
                    </div>
                    <div className='grid md:grid-cols-2 gap-8 max-w-5xl mx-auto'>
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className='group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300'
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${feature.gradient} rounded-2xl mb-6 text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {feature.icon}
                                </div>
                                <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                                    {feature.title}
                                </h3>
                                <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Values Section */}
                <section>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                            Our Values
                        </h2>
                        <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-gray-600 mx-auto mb-8'></div>
                    </div>
                    <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto'>
                        {values.map((value, index) => (
                            <div
                                key={index}
                                className='group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                            >
                                <div
                                    className={`inline-flex items-center justify-center w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl mb-4 ${value.color} group-hover:scale-110 transition-transform duration-300`}
                                >
                                    {value.icon}
                                </div>
                                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                                    {value.title}
                                </h3>
                                <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed'>
                                    {value.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Community Section */}
                <section className='max-w-4xl mx-auto'>
                    <div className='bg-gradient-to-r from-blue-600 via-gray-400 to-cyan-600 rounded-3xl p-1 shadow-2xl'>
                        <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 sm:p-12'>
                            <div className='text-center'>
                                <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-gray-600 rounded-2xl mb-6 shadow-lg'>
                                    <Users className='w-8 h-8 text-white' />
                                </div>
                                <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                                    Join Our Community
                                </h2>
                                <p className='text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8'>
                                    Whether you're a student, professional, or
                                    lifelong learner, Quiz Arena is here to help
                                    you achieve your learning goals. Join our
                                    growing community of knowledge seekers
                                    today!
                                </p>
                                <div className='flex flex-wrap justify-center gap-4 text-sm text-gray-600 dark:text-gray-400'>
                                    <div className='flex items-center gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-500' />
                                        <span>Free to join</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-500' />
                                        <span>No ads</span>
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        <CheckCircle className='w-4 h-4 text-green-500' />
                                        <span>Regular updates</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
