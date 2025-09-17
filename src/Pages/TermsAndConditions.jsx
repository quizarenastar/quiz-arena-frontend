import React from 'react';

const TermsAndConditions = () => {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6'>Terms and Conditions</h1>
            <div className='space-y-6'>
                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Acceptance of Terms
                    </h2>
                    <p className='text-gray-700'>
                        By accessing and using Quiz Arena, you accept and agree
                        to be bound by the terms and conditions outlined here.
                        If you do not agree to these terms, please do not use
                        our service.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        User Accounts
                    </h2>
                    <p className='text-gray-700'>
                        To access certain features of Quiz Arena, you must
                        register for an account. You are responsible for
                        maintaining the confidentiality of your account
                        credentials and for all activities under your account.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Quiz Participation
                    </h2>
                    <p className='text-gray-700'>Users must:</p>
                    <ul className='list-disc ml-6 mt-2 text-gray-700'>
                        <li>
                            Participate honestly and independently in quizzes
                        </li>
                        <li>Not share quiz answers or solutions with others</li>
                        <li>Respect the time limits and rules of each quiz</li>
                        <li>
                            Not use automated systems to participate in quizzes
                        </li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Intellectual Property
                    </h2>
                    <p className='text-gray-700'>
                        All content on Quiz Arena, including questions, images,
                        and other materials, is protected by copyright and other
                        intellectual property laws. Users may not copy,
                        distribute, or use this content without permission.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>Termination</h2>
                    <p className='text-gray-700'>
                        We reserve the right to terminate or suspend accounts
                        that violate these terms or engage in inappropriate
                        behavior on our platform.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Limitation of Liability
                    </h2>
                    <p className='text-gray-700'>
                        Quiz Arena is provided "as is" without any warranties.
                        We are not liable for any damages arising from your use
                        of our service.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Changes to Terms
                    </h2>
                    <p className='text-gray-700'>
                        We may modify these terms at any time. Continued use of
                        Quiz Arena after changes constitutes acceptance of the
                        new terms.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default TermsAndConditions;
