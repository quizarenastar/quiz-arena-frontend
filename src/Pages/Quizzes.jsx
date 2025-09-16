import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, Users, BookOpen } from 'lucide-react';

// Mock data - Later you can move this to your API
const quizzes = [
    {
        id: 1,
        title: 'JavaScript Fundamentals',
        description:
            'Test your knowledge of JavaScript basics including variables, functions, and objects.',
        category: 'Programming',
        timeLimit: 30,
        questionsCount: 20,
        participants: 1234,
        difficulty: 'Easy',
        image: 'https://source.unsplash.com/random/400x300?javascript',
    },
    {
        id: 2,
        title: 'World Geography',
        description:
            'Explore your knowledge about countries, capitals, and geographical features.',
        category: 'Geography',
        timeLimit: 25,
        questionsCount: 15,
        participants: 856,
        difficulty: 'Intermediate',
        image: 'https://source.unsplash.com/random/400x300?geography',
    },
    {
        id: 2,
        title: 'Sports',
        description:
            'Test your knowledge about various sports, athletes, and sporting events.',
        category: 'Sports',
        timeLimit: 25,
        questionsCount: 20,
        participants: 856,
        difficulty: 'Hard',
        image: 'https://source.unsplash.com/random/400x300?geography',
    },
    // Add more mock quizzes as needed
];

function QuizCard({ quiz }) {
    return (
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105 flex flex-col h-full'>
            <div className='relative'>
                <img
                    src={quiz.image}
                    alt={quiz.title}
                    className='w-full h-40 sm:h-48 lg:h-52 object-cover'
                    loading='lazy'
                />

                <span
                    className={`
                    absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-medium bg-white/90 dark:bg-gray-800/90
                    ${
                        quiz.difficulty === 'Easy'
                            ? 'text-green-600'
                            : quiz.difficulty === 'Intermediate'
                            ? 'text-yellow-600'
                            : 'text-red-600'
                    }`}
                >
                    {quiz.difficulty}
                </span>
            </div>

            <div className='p-4 sm:p-5 flex flex-col flex-grow'>
                <h3 className='text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2'>
                    {quiz.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 flex-grow'>
                    {quiz.description}
                </p>

                <div className='grid grid-cols-3 gap-2 text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4'>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <Clock className='w-4 h-4' />
                        <span>{quiz.timeLimit}m</span>
                    </div>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <BookOpen className='w-4 h-4' />
                        <span>{quiz.questionsCount}Q</span>
                    </div>
                    <div className='flex items-center gap-1 justify-center p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
                        <Users className='w-4 h-4' />
                        <span>{quiz.participants}</span>
                    </div>
                </div>

                <Link
                    to={`/quiz/${quiz.id}`}
                    className='block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2.5 rounded-lg transition-colors text-sm sm:text-base'
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
}

function Quizzes() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-6 sm:py-12'>
            <div className='max-w-7xl mx-auto px-4 sm:px-6'>
                <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8'>
                    <h1 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                        Available Quizzes
                    </h1>

                    <div className='flex flex-col sm:flex-row w-full sm:w-auto gap-3 sm:gap-4'>
                        <select className='w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                            <option value=''>All Categories</option>
                            <option value='programming'>Programming</option>
                            <option value='geography'>Geography</option>
                            <option value='science'>Science</option>
                            <option value='sports'>Sports</option>
                        </select>
                        <select className='w-full sm:w-40 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent'>
                            <option value=''>All Difficulties</option>
                            <option value='easy'>Easy</option>
                            <option value='intermediate'>Intermediate</option>
                            <option value='hard'>Hard</option>
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6'>
                    {quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Quizzes;
