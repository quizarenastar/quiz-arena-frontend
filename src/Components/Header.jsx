import React from 'react';

import { Link } from 'react-router-dom';

function Header() {
    return (
        <header className='bg-[#282c34] text-white shadow-md'>
            <div className='max-w-7xl mx-auto flex items-center justify-between px-4 py-3'>
                <Link
                    to='/'
                    className='text-2xl font-bold tracking-wide hover:text-yellow-400 transition-colors'
                >
                    Quiz Arena
                </Link>
                <nav className='flex gap-6'>
                    <Link
                        to='/'
                        className='hover:text-yellow-400 transition-colors font-medium'
                    >
                        Home
                    </Link>
                    <Link
                        to='/create-quiz'
                        className='hover:text-yellow-400 transition-colors font-medium'
                    >
                        Create Quiz
                    </Link>
                    <Link
                        to='/ai-quiz'
                        className='hover:text-yellow-400 transition-colors font-medium'
                    >
                        AI Quiz
                    </Link>
                    <Link
                        to='/leaderboard'
                        className='hover:text-yellow-400 transition-colors font-medium'
                    >
                        Leaderboard
                    </Link>
                </nav>
            </div>
        </header>
    );
}

export default Header;
