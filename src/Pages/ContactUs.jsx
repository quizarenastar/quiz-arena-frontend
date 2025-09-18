import React, { useState } from 'react';
import {
    Mail,
    MessageCircle,
    Send,
    Twitter,
    Facebook,
    Linkedin,
    MapPin,
    Clock,
    Phone,
    CheckCircle,
    AlertCircle,
} from 'lucide-react';
import ApiUrl from '../configs/apiUrls';
import toast from 'react-hot-toast';

const ContactUs = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: '',
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

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
        } finally {
            setIsSubmitting(false);
        }
    };

    const contactInfo = [
        {
            icon: <Mail className='w-6 h-6' />,
            title: 'Email',
            content: 'quizarenastar@gmail.com',
            subtitle: "We'll respond within 24 hours",
            color: 'from-blue-500 to-cyan-500',
        },
        {
            icon: <Clock className='w-6 h-6' />,
            title: 'Response Time',
            content: '24-48 hours',
            subtitle: 'Average response time',
            color: 'from-green-500 to-emerald-500',
        },
        {
            icon: <MessageCircle className='w-6 h-6' />,
            title: 'Support',
            content: 'Chat Support',
            subtitle: 'Available during business hours',
            color: 'from-purple-500 to-pink-500',
        },
    ];

    const socialLinks = [
        {
            icon: <Twitter className='w-5 h-5' />,
            name: 'Twitter',
            url: '#',
            color: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400',
        },
        {
            icon: <Facebook className='w-5 h-5' />,
            name: 'Facebook',
            url: '#',
            color: 'hover:bg-blue-100 hover:text-blue-600 dark:hover:bg-blue-900 dark:hover:text-blue-400',
        },
        {
            icon: <Linkedin className='w-5 h-5' />,
            name: 'LinkedIn',
            url: '#',
            color: 'hover:bg-blue-100 hover:text-blue-700 dark:hover:bg-blue-900 dark:hover:text-blue-300',
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                <div className='relative container mx-auto px-4 py-4 sm:py-8'>
                    <div className='text-center max-w-4xl mx-auto'>
                        <h1 className=' sm:text-1xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6'>
                            Contact Us
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-300 leading-relaxed'>
                            Have questions or suggestions? We'd love to hear
                            from you.
                        </p>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-12'>
                <div className='grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto'>
                    {/* Contact Information */}
                    <div className='space-y-8'>
                        <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700'>
                            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6'>
                                Get in Touch
                            </h2>
                            <p className='text-gray-600 dark:text-gray-300 leading-relaxed mb-8'>
                                Send us a message and we'll respond as soon as
                                possible. We're here to help you with any
                                questions or feedback you might have.
                            </p>

                            <div className='space-y-6'>
                                {contactInfo.map((info, index) => (
                                    <div
                                        key={index}
                                        className='flex items-start gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 hover:shadow-lg transition-all duration-300'
                                    >
                                        <div
                                            className={`flex-shrink-0 w-12 h-12 bg-gradient-to-r ${info.color} rounded-xl flex items-center justify-center text-white shadow-lg`}
                                        >
                                            {info.icon}
                                        </div>
                                        <div>
                                            <h3 className='text-lg font-bold text-gray-900 dark:text-white'>
                                                {info.title}
                                            </h3>
                                            <p className='text-gray-900 dark:text-gray-100 font-medium'>
                                                {info.content}
                                            </p>
                                            <p className='text-sm text-gray-600 dark:text-gray-400'>
                                                {info.subtitle}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className='bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700'>
                        <div className='flex items-center gap-3 mb-8'>
                            <div className='w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center'>
                                <Send className='w-6 h-6 text-white' />
                            </div>
                            <h2 className='text-2xl font-bold text-gray-900 dark:text-white'>
                                Send Message
                            </h2>
                        </div>

                        <div className='space-y-6'>
                            <div className='grid sm:grid-cols-2 gap-6'>
                                <div>
                                    <label
                                        htmlFor='name'
                                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
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
                                        className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300'
                                        placeholder='Your full name'
                                    />
                                </div>

                                <div>
                                    <label
                                        htmlFor='email'
                                        className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
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
                                        className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300'
                                        placeholder='your.email@example.com'
                                    />
                                </div>
                            </div>

                            <div>
                                <label
                                    htmlFor='subject'
                                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
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
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300'
                                    placeholder="What's this about?"
                                />
                            </div>

                            <div>
                                <label
                                    htmlFor='message'
                                    className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'
                                >
                                    Message
                                </label>
                                <textarea
                                    id='message'
                                    name='message'
                                    value={formData.message}
                                    onChange={handleChange}
                                    required
                                    rows='3'
                                    className='w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 resize-none'
                                    placeholder='Tell us more about your question or feedback...'
                                    minLength={10}
                                />
                            </div>

                            <button
                                type='submit'
                                disabled={isSubmitting}
                                className='w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2'
                            >
                                {isSubmitting ? (
                                    <>
                                        <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin'></div>
                                        Sending...
                                    </>
                                ) : (
                                    <>
                                        <Send className='w-5 h-5' />
                                        Send Message
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom decoration */}
            <div className='h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500'></div>
        </div>
    );
};

export default ContactUs;
