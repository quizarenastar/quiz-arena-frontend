import React, { useState } from 'react';
import ApiUrl from '../configs/apiUrls';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${ApiUrl.CONTACT.SUBMIT}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });
            const data = await response.json();
            if (data.success) {
                toast.success('Message sent successfully!');
                setFormData({ name: '', email: '', subject: '', message: '' });
            }
        } catch (error) {
            toast.error(`Error: ${error.message}`);
        }
    };

    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6'>Contact Us</h1>

            <div className='grid md:grid-cols-2 gap-8'>
                {/* Contact Information */}
                <div className='space-y-6'>
                    <section>
                        <h2 className='text-2xl font-semibold mb-3'>
                            Get in Touch
                        </h2>
                        <p className='text-gray-700 mb-4'>
                            Have questions or suggestions? We'd love to hear
                            from you. Send us a message and we'll respond as
                            soon as possible.
                        </p>
                    </section>

                    <div className='space-y-4'>
                        <div>
                            <h3 className='text-lg font-semibold'>Email</h3>
                            <p className='text-gray-700'>
                                support@quizarena.in
                            </p>
                        </div>

                        <div>
                            <h3 className='text-lg font-semibold'>Follow Us</h3>
                            <div className='flex space-x-4 mt-2'>
                                <a
                                    href='#'
                                    className='text-blue-600 hover:text-blue-800'
                                >
                                    Twitter
                                </a>
                                <a
                                    href='#'
                                    className='text-blue-600 hover:text-blue-800'
                                >
                                    Facebook
                                </a>
                                <a
                                    href='#'
                                    className='text-blue-600 hover:text-blue-800'
                                >
                                    LinkedIn
                                </a>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className='bg-white p-6 rounded-lg shadow-md'>
                    <form onSubmit={handleSubmit} className='space-y-4'>
                        <div>
                            <label
                                htmlFor='name'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Name
                            </label>
                            <input
                                type='text'
                                id='name'
                                name='name'
                                value={formData.name}
                                onChange={handleChange}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='email'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Email
                            </label>
                            <input
                                type='email'
                                id='email'
                                name='email'
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='subject'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Subject
                            </label>
                            <input
                                type='text'
                                id='subject'
                                name='subject'
                                value={formData.subject}
                                onChange={handleChange}
                                required
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                            />
                        </div>

                        <div>
                            <label
                                htmlFor='message'
                                className='block text-sm font-medium text-gray-700 mb-1'
                            >
                                Message
                            </label>
                            <textarea
                                id='message'
                                name='message'
                                value={formData.message}
                                onChange={handleChange}
                                required
                                rows='4'
                                className='w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500'
                                minLength={10}
                            ></textarea>
                        </div>

                        <button
                            type='submit'
                            className='w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-300'
                        >
                            Send Message
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default ContactUs;
