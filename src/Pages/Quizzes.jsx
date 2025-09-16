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
            'Sports build health, teamwork, and discipline while uniting people across cultures with passion and competition.',
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
        <div className='bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition-transform hover:scale-105'>
            <img
                src={quiz.image}
                alt={quiz.title}
                className='w-full h-48 object-cover'
            />
            <div className='p-6'>
                <div className='flex justify-between items-center mb-2'>
                    <span className='text-sm text-yellow-500 font-semibold'>
                        {quiz.category}
                    </span>
                    <span
                        className={`
                        px-3 py-1 rounded-full text-xs font-medium
                        ${
                            quiz.difficulty === 'Easy'
                                ? 'bg-green-100 text-green-600'
                                : quiz.difficulty === 'Intermediate'
                                ? 'bg-yellow-100 text-yellow-600'
                                : 'bg-red-100 text-red-600'
                        }
                    `}
                    >
                        {quiz.difficulty}
                    </span>
                </div>
                <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
                    {quiz.title}
                </h3>
                <p className='text-gray-600 dark:text-gray-300 text-sm mb-4'>
                    {quiz.description}
                </p>
                <div className='flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4'>
                    <div className='flex items-center gap-1'>
                        <Clock size={16} />
                        <span>{quiz.timeLimit} mins</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <BookOpen size={16} />
                        <span>{quiz.questionsCount} questions</span>
                    </div>
                    <div className='flex items-center gap-1'>
                        <Users size={16} />
                        <span>{quiz.participants}</span>
                    </div>
                </div>
                <Link
                    to={`/quiz/${quiz.id}`}
                    className='block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition-colors'
                >
                    Start Quiz
                </Link>
            </div>
        </div>
    );
}

function Quizzes() {
    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-12'>
            <div className='max-w-7xl mx-auto px-4'>
                <div className='flex justify-between items-center mb-8'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                        Available Quizzes
                    </h1>
                    <div className='flex gap-4'>
                        <select className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                            <option value=''>All Categories</option>
                            <option value='programming'>Programming</option>
                            <option value='geography'>Geography</option>
                            <option value='science'>Science</option>
                            <option value='science'>Sports</option>
                        </select>
                        <select className='px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300'>
                            <option value=''>All Difficulties</option>
                            <option value='easy'>Easy</option>
                            <option value='intermediate'>Intermediate</option>
                            <option value='hard'>Hard</option>
                        </select>
                    </div>
                </div>

                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {quizzes.map((quiz) => (
                        <QuizCard key={quiz.id} quiz={quiz} />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Quizzes;
