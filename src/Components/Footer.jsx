import React from 'react';
import { Instagram, Linkedin, Youtube } from 'lucide-react';

function Footer() {
    return (
        <footer className='bg-blue-50 text-gray-900 w-full dark:bg-gray-900 dark:text-white transition-colors duration-200'>
            <div className='max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 py-3 gap-3 md:gap-0'>
                {/* Left */}
                <div className='font-semibold mb-2 md:mb-0'>
                    Connect with us
                </div>
                {/* Middle */}
                <div className='flex flex-col md:flex-row gap-2 md:gap-6 items-center'>
                    <a href='/contact' className='hover:text-yellow-400'>
                        Contact Us
                    </a>
                    <a href='/about' className='hover:text-yellow-400'>
                        About Us
                    </a>
                    <a href='/privacy-policy' className='hover:text-yellow-400'>
                        Privacy Policy
                    </a>
                    <a
                        href='/terms-and-conditions'
                        className='hover:text-yellow-400'
                    >
                        T&amp;C
                    </a>
                </div>
                {/* Right */}
                <div className='flex gap-4 mt-2 md:mt-0'>
                    <a
                        href='https://www.instagram.com/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-pink-400'
                    >
                        <Instagram size={22} />
                    </a>
                    <a
                        href='https://www.linkedin.com/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-blue-400'
                    >
                        <Linkedin size={22} />
                    </a>
                    <a
                        href='https://www.youtube.com/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-red-500'
                    >
                        <Youtube size={22} />
                    </a>
                    <a
                        href='https://wa.me/'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='hover:text-green-400'
                    ></a>
                </div>
            </div>
        </footer>
    );
}

export default Footer;
