import { ArrowRight, Trophy, Clock, Users, Lock, Calendar, Timer } from 'lucide-react';
import { Link } from 'react-router-dom';
import { features, testimonials } from '../constants/homeData';
import pic from '../assets/QA.png';
import { useState, useEffect, useCallback } from 'react';
import QuizService from '../service/QuizService';

/* ────── helpers ────── */
function formatDuration(seconds) {
    if (!seconds) return '–';
    const m = Math.floor(seconds / 60);
    return m > 0 ? `${m}m` : `${seconds}s`;
}

function formatCountdown(targetDate) {
    const diff = new Date(targetDate) - new Date();
    if (diff <= 0) return 'LIVE NOW';
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    if (h >= 24) {
        const days = Math.floor(h / 24);
        return `${days}d ${h % 24}h`;
    }
    return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

function useCountdown(targetDate) {
    const [display, setDisplay] = useState('');
    useEffect(() => {
        if (!targetDate) return;
        const tick = () => setDisplay(formatCountdown(targetDate));
        tick();
        const id = setInterval(tick, 1000);
        return () => clearInterval(id);
    }, [targetDate]);
    return display;
}

function getStatus(quiz) {
    const n = new Date();
    const start = quiz.startTime ? new Date(quiz.startTime) : null;
    const end = quiz.endTime ? new Date(quiz.endTime) : null;
    if (!start) return 'ongoing';
    if (n < start) return 'upcoming';
    if (end && n > end) return 'ended';
    return 'ongoing';
}

/* ────── PaidQuizCard ────── */
function PaidQuizCard({ quiz }) {
    const status = getStatus(quiz);
    const countdown = useCountdown(
        status === 'upcoming' ? quiz.startTime : status === 'ongoing' ? quiz.endTime : null
    );

    const gradients = [
        'from-indigo-600 to-purple-700',
        'from-rose-500 to-pink-700',
        'from-amber-500 to-orange-600',
        'from-cyan-500 to-blue-700',
        'from-emerald-500 to-teal-700',
    ];
    const gradient = gradients[quiz.title?.length % gradients.length] || gradients[0];

    return (
        <div className={`relative rounded-2xl bg-gradient-to-br ${gradient} p-px shadow-lg hover:shadow-2xl hover:-translate-y-1 transition-all duration-200 overflow-hidden`}>
            <div className='bg-gray-900/80 rounded-2xl p-5 h-full flex flex-col gap-3 backdrop-blur-sm'>
                {/* Status badge */}
                <div className='flex items-center justify-between'>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
                        status === 'ongoing' ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/40' :
                        status === 'upcoming' ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40' :
                        'bg-gray-500/20 text-gray-400 ring-1 ring-gray-500/40'
                    }`}>
                        {status === 'ongoing' ? '🟢 LIVE' : status === 'upcoming' ? '🔵 UPCOMING' : '⚫ ENDED'}
                    </span>
                    <span className='text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-0.5 rounded-full ring-1 ring-amber-400/30'>
                        ₹{quiz.price}
                    </span>
                </div>

                {/* Title */}
                <div>
                    <h3 className='text-white font-bold text-base line-clamp-2 leading-snug'>{quiz.title}</h3>
                    <p className='text-gray-400 text-xs mt-1 line-clamp-2'>{quiz.description || 'No description'}</p>
                </div>

                {/* Prize pool */}
                {quiz.prizePool?.totalAmount > 0 && (
                    <div className='flex items-center gap-2 bg-amber-500/10 rounded-lg px-3 py-1.5'>
                        <Trophy size={14} className='text-amber-400' />
                        <span className='text-amber-300 text-xs font-semibold'>
                            Prize Pool: ₹{quiz.prizePool.totalAmount}
                        </span>
                    </div>
                )}

                {/* Stats */}
                <div className='flex items-center gap-4 text-xs text-gray-400'>
                    <span className='flex items-center gap-1'>
                        <Clock size={12} /> {formatDuration(quiz.duration || quiz.timeLimit)}
                    </span>
                    <span className='flex items-center gap-1'>
                        <Users size={12} /> {quiz.participantManagement?.participantCount || 0} joined
                    </span>
                </div>

                {/* Countdown */}
                {countdown && (
                    <div className='flex items-center gap-1.5 text-xs font-mono text-white bg-white/5 rounded-lg px-3 py-1.5'>
                        <Timer size={12} className='text-gray-400' />
                        <span className='text-gray-400'>
                            {status === 'upcoming' ? 'Starts in:' : 'Ends in:'}
                        </span>
                        <span className='font-bold text-white'>{countdown}</span>
                    </div>
                )}

                {/* CTA */}
                <Link
                    to={`/quiz/${quiz._id}`}
                    className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                        status === 'ongoing'
                            ? 'bg-green-500 hover:bg-green-400 text-white'
                            : status === 'upcoming'
                            ? 'bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-purple-400 text-white'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-300'
                    }`}
                >
                    {status === 'ongoing' ? (
                        <><Lock size={14} /> Attempt Now</>
                    ) : status === 'upcoming' ? (
                        <><Lock size={14} /> Register</>
                    ) : (
                        <><Trophy size={14} /> View Results</>
                    )}
                </Link>
            </div>
        </div>
    );
}

/* ────── Main ────── */
export default function Home() {
    const [paidQuizzes, setPaidQuizzes] = useState([]);
    const [loadingPaid, setLoadingPaid] = useState(true);

    const fetchPaid = useCallback(async () => {
        try {
            const res = await QuizService.getPublicQuizzes({ isPaid: true });
            // Sort: ongoing first, then upcoming, then ended
            const list = (res.data.quizzes || []).filter((q) => q.isPaid);
            const order = { ongoing: 0, upcoming: 1, ended: 2 };
            list.sort((a, b) => (order[getStatus(a)] ?? 3) - (order[getStatus(b)] ?? 3));
            setPaidQuizzes(list.slice(0, 6));
        } catch {
            // silently ignore on home page
        } finally {
            setLoadingPaid(false);
        }
    }, []);

    useEffect(() => { fetchPaid(); }, [fetchPaid]);

    return (
        <div className='bg-blue-50 dark:bg-gray-900 min-h-screen transition-colors duration-200'>
            {/* ── Hero ── */}
            <section className='max-w-7xl mx-auto px-4 py-20'>
                <div className='flex flex-col md:flex-row items-center justify-between gap-10'>
                    <div className='flex-1 space-y-6'>
                        <h1 className='text-4xl md:text-6xl font-bold text-gray-900 dark:text-white'>
                            Challenge Your Mind,
                            <br />
                            <span className='text-blue-400'>Quiz Your Way</span>{' '}
                            to Excellence
                        </h1>
                        <p className='text-lg text-gray-600 dark:text-gray-300'>
                            Join thousands of quiz enthusiasts in creating, sharing, and
                            participating in engaging quizzes across various topics.
                        </p>
                        <div className='flex gap-4'>
                            <Link
                                to='/create-quiz'
                                className='px-6 py-3 bg-blue-300 hover:bg-blue-200 text-gray-900 rounded-lg font-semibold flex items-center gap-2'
                            >
                                Create Quiz <ArrowRight size={20} />
                            </Link>
                            <Link
                                to='/quizzes'
                                className='px-6 py-3 border-2 border-blue-300 text-black dark:text-white hover:bg-blue-300 hover:text-gray-900 rounded-lg font-semibold transition-colors'
                            >
                                Participate
                            </Link>
                        </div>
                    </div>
                    <div className='flex-1'>
                        <img
                            src={pic}
                            className='w-full max-w-md mx-auto rounded-3xl shadow-lg'
                            alt='Quiz Arena'
                        />
                    </div>
                </div>
            </section>

            {/* ── Paid / Prize Quizzes ── */}
            {(loadingPaid || paidQuizzes.length > 0) && (
                <section className='py-16 bg-gray-900 dark:bg-gray-950'>
                    <div className='max-w-7xl mx-auto px-4'>
                        {/* Section header */}
                        <div className='flex items-end justify-between mb-8'>
                            <div>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Trophy className='w-5 h-5 text-amber-400' />
                                    <span className='text-xs font-bold text-amber-400 uppercase tracking-widest'>
                                        Prize Competitions
                                    </span>
                                </div>
                                <h2 className='text-2xl font-bold text-white'>
                                    Win Real <span className='text-amber-400'>Prize Money</span>
                                </h2>
                                <p className='text-gray-400 mt-1 text-sm'>
                                    Register, compete and win from our prize pool quizzes
                                </p>
                            </div>
                            <Link
                                to='/quizzes'
                                className='hidden sm:flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors'
                            >
                                View all <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Cards */}
                        {loadingPaid ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className='h-64 bg-gray-800 rounded-2xl animate-pulse' />
                                ))}
                            </div>
                        ) : paidQuizzes.length === 0 ? (
                            <div className='text-center py-12 text-gray-500'>
                                No active prize quizzes right now. Check back soon!
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {paidQuizzes.map((quiz) => (
                                    <PaidQuizCard key={quiz._id} quiz={quiz} />
                                ))}
                            </div>
                        )}

                        <div className='mt-6 sm:hidden text-center'>
                            <Link
                                to='/quizzes'
                                className='inline-flex items-center gap-1 text-sm text-amber-400 hover:text-amber-300 font-semibold'
                            >
                                View all quizzes <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ── Features ── */}
            <section className='bg-white dark:bg-gray-800 py-20 transition-colors duration-200'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
                        Why Choose Quiz Arena?
                    </h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        {features.map((feature, index) => {
                            const IconComponent = feature.icon;
                            return (
                                <div
                                    key={index}
                                    className='text-center p-6 rounded-lg bg-blue-50 dark:bg-gray-700'
                                >
                                    <div className='flex justify-center mb-4'>
                                        <IconComponent className='w-12 h-12 text-blue-400' />
                                    </div>
                                    <h3 className='text-xl font-semibold mb-2 text-gray-900 dark:text-white'>
                                        {feature.title}
                                    </h3>
                                    <p className='text-gray-600 dark:text-gray-300'>
                                        {feature.description}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ── Testimonials ── */}
            <section className='py-20'>
                <div className='max-w-7xl mx-auto px-4'>
                    <h2 className='text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white'>
                        What Our Users Say
                    </h2>
                    <div className='grid md:grid-cols-3 gap-8'>
                        {testimonials.map((testimonial, index) => (
                            <div
                                key={index}
                                className='p-6 rounded-lg bg-white dark:bg-gray-800 shadow-lg'
                            >
                                <p className='text-gray-600 dark:text-gray-300 mb-4'>
                                    {testimonial.text}
                                </p>
                                <div>
                                    <p className='font-semibold text-gray-900 dark:text-white'>
                                        {testimonial.author}
                                    </p>
                                    <p className='text-sm text-blue-500'>{testimonial.role}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}
