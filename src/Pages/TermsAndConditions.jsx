import React from 'react';
import {
    Shield,
    Users,
    Trophy,
    Copyright,
    XCircle,
    AlertTriangle,
    FileText,
    ChevronRight,
    Sparkles,
    Clock,
} from 'lucide-react';

const TermsAndConditions = () => {
    const sections = [
        {
            id: 'acceptance',
            title: 'Acceptance of Terms',
            icon: Shield,
            content:
                'By accessing and using Quiz Arena, you accept and agree to be bound by the terms and conditions outlined here. If you do not agree to these terms, please do not use our service.',
        },
        {
            id: 'accounts',
            title: 'User Accounts',
            icon: Users,
            content:
                'To access certain features of Quiz Arena, you must register for an account. You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.',
        },
        {
            id: 'participation',
            title: 'Quiz Participation',
            icon: Trophy,
            content:
                'Users must participate honestly and independently in quizzes, not share answers with others, respect time limits and rules, and not use automated systems to participate.',
            list: [
                'Participate honestly and independently in quizzes',
                'Not share quiz answers or solutions with others',
                'Respect the time limits and rules of each quiz',
                'Not use automated systems to participate in quizzes',
            ],
        },
        {
            id: 'ip',
            title: 'Intellectual Property',
            icon: Copyright,
            content:
                'All content on Quiz Arena, including questions, images, and other materials, is protected by copyright and other intellectual property laws. Users may not copy, distribute, or use this content without permission.',
        },
        {
            id: 'termination',
            title: 'Termination',
            icon: XCircle,
            content:
                'We reserve the right to terminate or suspend accounts that violate these terms or engage in inappropriate behavior on our platform.',
        },
        {
            id: 'liability',
            title: 'Limitation of Liability',
            icon: AlertTriangle,
            content:
                'Quiz Arena is provided "as is" without any warranties. We are not liable for any damages arising from your use of our service.',
        },
        {
            id: 'changes',
            title: 'Changes to Terms',
            icon: FileText,
            content:
                'We may modify these terms at any time. Continued use of Quiz Arena after changes constitutes acceptance of the new terms.',
        },
    ];

    return (
        <div className='min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 relative overflow-hidden'>
            {/* Animated Background Elements */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-1/4 -right-20 w-64 h-64 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl animate-pulse'></div>
                <div className='absolute bottom-1/4 -left-20 w-64 h-64 bg-gradient-to-br from-indigo-400/20 to-pink-400/20 rounded-full blur-3xl animate-pulse delay-1000'></div>
            </div>

            <div className='container mx-auto px-4 py-12 max-w-5xl relative z-10'>
                {/* Hero Header */}
                <div className='text-center mb-16'>
                    <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-6'>
                        <Sparkles size={16} />
                        Legal Documentation
                    </div>
                    <h1 className='text-5xl md:text-7xl font-black mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 dark:from-blue-400 dark:via-purple-400 dark:to-indigo-400 bg-clip-text text-transparent leading-tight'>
                        Terms & Conditions
                    </h1>
                    <p className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed'>
                        Your guide to using Quiz Arena responsibly and safely
                    </p>
                    <div className='flex items-center justify-center gap-2 mt-4 text-gray-500 dark:text-gray-400'>
                        <Clock size={16} />
                        <span className='text-sm'>
                            Last updated: September 2025
                        </span>
                    </div>
                </div>

                {/* Quick Navigation Card */}
                <div className='mb-12'>
                    <div className='backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50'>
                        <div className='flex items-center gap-3 mb-6'>
                            <div className='p-2 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 text-white'>
                                <ChevronRight size={20} />
                            </div>
                            <h3 className='text-2xl font-bold text-gray-800 dark:text-white'>
                                Quick Navigation
                            </h3>
                        </div>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
                            {sections.map((section) => (
                                <a
                                    key={section.id}
                                    href={`#${section.id}`}
                                    className='group flex items-center gap-3 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700/50 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 transition-all duration-300 hover:scale-105 hover:shadow-lg border border-transparent hover:border-blue-200 dark:hover:border-blue-700'
                                >
                                    <div className='p-2 rounded-lg bg-white dark:bg-gray-600 shadow-sm group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-purple-500 group-hover:text-white transition-all duration-300'>
                                        <section.icon
                                            size={18}
                                            className='text-gray-600 dark:text-gray-300 group-hover:text-white'
                                        />
                                    </div>
                                    <span className='text-sm font-semibold text-gray-700 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white transition-colors duration-300'>
                                        {section.title}
                                    </span>
                                </a>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Terms Sections */}
                <div className='space-y-8'>
                    {sections.map((section, index) => {
                        const IconComponent = section.icon;
                        return (
                            <section
                                key={section.id}
                                id={section.id}
                                className='group relative'
                            >
                                <div className='backdrop-blur-xl bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 md:p-10 shadow-2xl border border-white/20 dark:border-gray-700/50 hover:shadow-3xl transition-all duration-500 hover:scale-[1.01]'>
                                    {/* Section Number */}
                                    <div className='absolute -top-4 -left-4 w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 text-white flex items-center justify-center text-sm font-bold shadow-lg'>
                                        {index + 1}
                                    </div>

                                    <div className='flex flex-col md:flex-row md:items-start gap-6'>
                                        <div className='flex-shrink-0'>
                                            <div className='p-4 rounded-2xl bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900/30 dark:to-purple-900/30 border border-blue-200/50 dark:border-blue-700/50 group-hover:scale-110 transition-transform duration-300'>
                                                <IconComponent
                                                    size={32}
                                                    className='text-blue-600 dark:text-blue-400'
                                                />
                                            </div>
                                        </div>

                                        <div className='flex-1'>
                                            <div className='mb-4'>
                                                <h2 className='text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-2'>
                                                    {section.title}
                                                </h2>
                                                <div className='w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
                                            </div>

                                            <p className='text-lg leading-relaxed text-gray-700 dark:text-gray-300 mb-6'>
                                                {section.content}
                                            </p>

                                            {section.list && (
                                                <div className='bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6 border border-gray-200/50 dark:border-gray-600/50'>
                                                    <h4 className='text-sm font-semibold text-gray-600 dark:text-gray-400 mb-4 uppercase tracking-wide'>
                                                        Requirements:
                                                    </h4>
                                                    <ul className='space-y-3'>
                                                        {section.list.map(
                                                            (
                                                                item,
                                                                itemIndex
                                                            ) => (
                                                                <li
                                                                    key={
                                                                        itemIndex
                                                                    }
                                                                    className='flex items-start gap-4 text-gray-700 dark:text-gray-300'
                                                                >
                                                                    <div className='w-6 h-6 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5'>
                                                                        <div className='w-2 h-2 bg-white rounded-full'></div>
                                                                    </div>
                                                                    <span className='leading-relaxed'>
                                                                        {item}
                                                                    </span>
                                                                </li>
                                                            )
                                                        )}
                                                    </ul>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>

                {/* Footer */}
                <div className='mt-16'>
                    <div className='backdrop-blur-xl bg-gradient-to-r from-blue-50/80 to-purple-50/80 dark:from-gray-800/80 dark:to-gray-700/80 rounded-3xl p-8 shadow-2xl border border-white/20 dark:border-gray-700/50 text-center'>
                        <div className='inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium mb-6'>
                            <Shield size={16} />
                            Agreement Confirmation
                        </div>

                        <h3 className='text-2xl font-bold text-gray-800 dark:text-white mb-4'>
                            Ready to Get Started?
                        </h3>

                        <p className='text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-6'>
                            By continuing to use Quiz Arena, you acknowledge
                            that you have read, understood, and agree to these
                            terms and conditions.
                        </p>

                        <div className='flex flex-col sm:flex-row gap-4 justify-center items-center pt-6 border-t border-gray-200/50 dark:border-gray-600/50'>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                © 2025 Quiz Arena. All rights reserved.
                            </p>
                            <div className='hidden sm:block w-px h-4 bg-gray-300 dark:bg-gray-600'></div>
                            <p className='text-sm text-gray-500 dark:text-gray-400'>
                                Questions? Contact our support team.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsAndConditions;
