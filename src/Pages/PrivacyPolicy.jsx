import React from 'react';
import {
    Shield,
    Database,
    Lock,
    UserCheck,
    RefreshCw,
    Mail,
    Eye,
    Settings,
    AlertCircle,
    CheckCircle,
} from 'lucide-react';

const PrivacyPolicy = () => {
    const sections = [
        {
            icon: <Database className='w-6 h-6' />,
            title: 'Information We Collect',
            content:
                'We collect information that you provide directly to us, including when you create an account, participate in quizzes, or contact us for support. This may include your name, email address, and quiz performance data.',
            color: 'from-blue-500 to-cyan-500',
            items: null,
        },
        {
            icon: <Settings className='w-6 h-6' />,
            title: 'How We Use Your Information',
            content: 'We use the information we collect to:',
            color: 'from-purple-500 to-pink-500',
            items: [
                'Provide, maintain, and improve our services',
                'Process and track your quiz participation',
                'Send you technical notices and support messages',
                'Respond to your comments and questions',
            ],
        },
        {
            icon: <Lock className='w-6 h-6' />,
            title: 'Data Security',
            content:
                'We implement appropriate security measures to protect your personal information. However, no method of transmission over the Internet is 100% secure, and we cannot guarantee absolute security.',
            color: 'from-green-500 to-emerald-500',
            items: null,
        },
        {
            icon: <UserCheck className='w-6 h-6' />,
            title: 'Your Rights',
            content:
                'You have the right to access, update, or delete your personal information. You can do this through your account settings or by contacting us directly.',
            color: 'from-orange-500 to-red-500',
            items: null,
        },
        {
            icon: <RefreshCw className='w-6 h-6' />,
            title: 'Updates to This Policy',
            content:
                'We may update this privacy policy from time to time. We will notify you of any changes by posting the new policy on this page and updating the effective date.',
            color: 'from-indigo-500 to-purple-500',
            items: null,
        },
        {
            icon: <Mail className='w-6 h-6' />,
            title: 'Contact Us',
            content:
                'If you have any questions about this Privacy Policy, please contact us through our contact page.',
            color: 'from-teal-500 to-blue-500',
            items: null,
        },
    ];

    const keyPrinciples = [
        {
            icon: <Eye className='w-5 h-5' />,
            title: 'Transparency',
            description: "We're clear about what data we collect",
        },
        {
            icon: <Lock className='w-5 h-5' />,
            title: 'Security',
            description: 'Your data is protected with industry standards',
        },
        {
            icon: <UserCheck className='w-5 h-5' />,
            title: 'Control',
            description: 'You have full control over your information',
        },
        {
            icon: <CheckCircle className='w-5 h-5' />,
            title: 'Compliance',
            description: 'We follow all applicable privacy regulations',
        },
    ];

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
            {/* Hero Section */}
            <div className='relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 opacity-10 dark:opacity-20'></div>
                <div className='relative container mx-auto px-4 py-16 sm:py-24'>
                    <div className='text-center max-w-4xl mx-auto'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg'>
                            <Shield className='w-8 h-8 text-white' />
                        </div>
                        <h1 className='text-4xl sm:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 dark:from-white dark:via-blue-200 dark:to-purple-200 bg-clip-text text-transparent mb-6'>
                            Privacy Policy
                        </h1>
                        <p className='text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-8'>
                            Your privacy is important to us. This policy
                            explains how we collect, use, and protect your
                            information.
                        </p>
                        <div className='inline-flex items-center gap-2 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 px-4 py-2 rounded-full text-sm font-medium'>
                            <CheckCircle className='w-4 h-4' />
                            Last updated: September 2025
                        </div>
                    </div>
                </div>
            </div>

            <div className='container mx-auto px-4 py-12 space-y-16'>
                {/* Key Principles */}
                <section className='max-w-6xl mx-auto'>
                    <div className='text-center mb-12'>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-6'>
                            Our Privacy Principles
                        </h2>
                        <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto mb-8'></div>
                    </div>
                    <div className='grid sm:grid-cols-2 lg:grid-cols-4 gap-6'>
                        {keyPrinciples.map((principle, index) => (
                            <div
                                key={index}
                                className='group bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl hover:-translate-y-1 transition-all duration-300'
                            >
                                <div className='inline-flex items-center justify-center w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-xl mb-4 text-blue-600 dark:text-blue-400 group-hover:scale-110 transition-transform duration-300'>
                                    {principle.icon}
                                </div>
                                <h3 className='text-lg font-bold text-gray-900 dark:text-white mb-2'>
                                    {principle.title}
                                </h3>
                                <p className='text-gray-600 dark:text-gray-300 text-sm'>
                                    {principle.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Policy Sections */}
                <section className='max-w-4xl mx-auto space-y-8'>
                    {sections.map((section, index) => (
                        <div
                            key={index}
                            className='group bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all duration-300'
                        >
                            <div className='flex items-start gap-6'>
                                <div
                                    className={`flex-shrink-0 inline-flex items-center justify-center w-14 h-14 bg-gradient-to-r ${section.color} rounded-2xl text-white shadow-lg group-hover:scale-105 transition-transform duration-300`}
                                >
                                    {section.icon}
                                </div>
                                <div className='flex-1'>
                                    <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                                        {section.title}
                                    </h2>
                                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed mb-4'>
                                        {section.content}
                                    </p>
                                    {section.items && (
                                        <ul className='space-y-3'>
                                            {section.items.map(
                                                (item, itemIndex) => (
                                                    <li
                                                        key={itemIndex}
                                                        className='flex items-start gap-3 text-gray-700 dark:text-gray-300'
                                                    >
                                                        <CheckCircle className='w-5 h-5 text-green-500 mt-0.5 flex-shrink-0' />
                                                        <span className='leading-relaxed'>
                                                            {item}
                                                        </span>
                                                    </li>
                                                )
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </section>

                {/* Important Notice */}
                <section className='max-w-4xl mx-auto'>
                    <div className='bg-gradient-to-r from-amber-500 to-orange-500 rounded-3xl p-1 shadow-2xl'>
                        <div className='bg-white dark:bg-gray-800 rounded-3xl p-8'>
                            <div className='flex items-start gap-4'>
                                <div className='flex-shrink-0 w-12 h-12 bg-amber-100 dark:bg-amber-900 rounded-xl flex items-center justify-center'>
                                    <AlertCircle className='w-6 h-6 text-amber-600 dark:text-amber-400' />
                                </div>
                                <div>
                                    <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-3'>
                                        Important Notice
                                    </h3>
                                    <p className='text-gray-700 dark:text-gray-300 leading-relaxed'>
                                        By using Quiz Arena, you agree to this
                                        Privacy Policy. We recommend reviewing
                                        this policy periodically as we may
                                        update it to reflect changes in our
                                        practices or applicable laws. Your
                                        continued use of our services after any
                                        modifications indicates your acceptance
                                        of the updated policy.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Contact Section */}
                <section className='max-w-4xl mx-auto'>
                    <div className='text-center bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 rounded-3xl p-8 border border-gray-200 dark:border-gray-700'>
                        <div className='inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mb-6 shadow-lg'>
                            <Mail className='w-8 h-8 text-white' />
                        </div>
                        <h3 className='text-2xl font-bold text-gray-900 dark:text-white mb-4'>
                            Questions About Your Privacy?
                        </h3>
                        <p className='text-gray-600 dark:text-gray-300 mb-6'>
                            We're here to help. If you have any questions or
                            concerns about our privacy practices, don't hesitate
                            to reach out.
                        </p>
                        <button className='inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg hover:-translate-y-1 transition-all duration-300'>
                            <Mail className='w-4 h-4' />
                            Contact Support
                        </button>
                    </div>
                </section>
            </div>

            {/* Bottom decoration */}
            <div className='h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-green-500'></div>
        </div>
    );
};

export default PrivacyPolicy;
