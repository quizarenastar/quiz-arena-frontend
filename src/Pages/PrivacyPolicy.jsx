import React from 'react';

const PrivacyPolicy = () => {
    return (
        <div className='container mx-auto px-4 py-8'>
            <h1 className='text-3xl font-bold mb-6'>Privacy Policy</h1>
            <div className='space-y-6'>
                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Information We Collect
                    </h2>
                    <p className='text-gray-700'>
                        We collect information that you provide directly to us,
                        including when you create an account, participate in
                        quizzes, or contact us for support. This may include
                        your name, email address, and quiz performance data.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        How We Use Your Information
                    </h2>
                    <p className='text-gray-700'>
                        We use the information we collect to:
                    </p>
                    <ul className='list-disc ml-6 mt-2 text-gray-700'>
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process and track your quiz participation</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Respond to your comments and questions</li>
                    </ul>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Data Security
                    </h2>
                    <p className='text-gray-700'>
                        We implement appropriate security measures to protect
                        your personal information. However, no method of
                        transmission over the Internet is 100% secure, and we
                        cannot guarantee absolute security.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>Your Rights</h2>
                    <p className='text-gray-700'>
                        You have the right to access, update, or delete your
                        personal information. You can do this through your
                        account settings or by contacting us directly.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>
                        Updates to This Policy
                    </h2>
                    <p className='text-gray-700'>
                        We may update this privacy policy from time to time. We
                        will notify you of any changes by posting the new policy
                        on this page and updating the effective date.
                    </p>
                </section>

                <section>
                    <h2 className='text-2xl font-semibold mb-3'>Contact Us</h2>
                    <p className='text-gray-700'>
                        If you have any questions about this Privacy Policy,
                        please contact us through our contact page.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
