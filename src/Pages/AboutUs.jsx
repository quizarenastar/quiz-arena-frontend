import React from 'react';

const AboutUs = () => {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6'>About Quiz Arena</h1>
            <div className='space-y-6'>
                <section>
                    <h2 className='text-2xl font-semibold mb-3'>Our Mission</h2>
                    <p className='text-gray-700'>
                        Quiz Arena is dedicated to making learning fun and
                        engaging through interactive quizzes. We believe that
                        knowledge should be accessible to everyone, and that
                        learning is more effective when it's enjoyable.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        What We Offer
                    </h2>
                    <div className='grid md:grid-cols-2 gap-4 mt-2'>
                        <div className='p-4 bg-white rounded-lg shadow'>
                            <h3 className='text-xl font-semibold mb-2'>
                                Interactive Quizzes
                            </h3>
                            <p className='text-gray-600'>
                                Engaging quizzes across various topics and
                                difficulty levels to challenge and improve your
                                knowledge.
                            </p>
                        </div>
                        <div className='p-4 bg-white rounded-lg shadow'>
                            <h3 className='text-xl font-semibold mb-2'>
                                Learning Resources
                            </h3>
                            <p className='text-gray-600'>
                                Access to comprehensive study materials and
                                explanations to help you understand topics
                                better.
                            </p>
                        </div>
                    </div>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>Our Values</h2>
                    <ul className='list-disc ml-6 text-gray-700'>
                        <li className='mb-2'>
                            <strong>Quality:</strong> We ensure our quizzes are
                            accurate, relevant, and up-to-date.
                        </li>
                        <li className='mb-2'>
                            <strong>Accessibility:</strong> We strive to make
                            our platform accessible to learners from all
                            backgrounds.
                        </li>
                        <li className='mb-2'>
                            <strong>Innovation:</strong> We continuously improve
                            our platform with new features and learning methods.
                        </li>
                        <li className='mb-2'>
                            <strong>Community:</strong> We foster a supportive
                            environment where learners can grow together.
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Join Our Community
                    </h2>
                    <p className='text-gray-700'>
                        Whether you're a student, professional, or lifelong
                        learner, Quiz Arena is here to help you achieve your
                        learning goals. Join our growing community of knowledge
                        seekers today!
                    </p>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
