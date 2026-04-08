import {
    ArrowRight,
    Trophy,
    Clock,
    Users,
    Lock,
    Timer,
    Star,
    Quote,
    ChevronRight,
    Zap,
    Sword,
    Sparkles,
    CircleDot,
    Play,
    CheckCircle2,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import {
    features,
    testimonials,
    stats,
    howItWorks,
} from '../constants/homeData';
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
        status === 'upcoming'
            ? quiz.startTime
            : status === 'ongoing'
              ? quiz.endTime
              : null,
    );

    const gradients = [
        'from-indigo-600 via-violet-600 to-purple-700',
        'from-rose-500 via-pink-600 to-fuchsia-700',
        'from-amber-500 via-orange-500 to-red-600',
        'from-cyan-500 via-blue-600 to-indigo-700',
        'from-emerald-500 via-teal-600 to-cyan-700',
    ];
    const gradient = gradients[(quiz.title?.length ?? 0) % gradients.length];
    const isLive = status === 'ongoing';

    return (
        <div
            className={`group relative rounded-2xl bg-gradient-to-br ${gradient} p-px shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden ${isLive ? 'animate-pulse-border' : ''}`}
        >
            {isLive && (
                <span className='absolute -inset-px rounded-2xl bg-gradient-to-br from-green-400/30 to-transparent pointer-events-none' />
            )}
            <div className='relative bg-white/95 dark:bg-gray-900/90 rounded-2xl p-5 h-full flex flex-col gap-3 backdrop-blur-sm'>
                {/* Status + Price */}
                <div className='flex items-center justify-between'>
                    <span
                        className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                            isLive
                                ? 'bg-green-500/20 text-green-400 ring-1 ring-green-500/40'
                                : status === 'upcoming'
                                  ? 'bg-blue-500/20 text-blue-400 ring-1 ring-blue-500/40'
                                  : 'bg-gray-600/30 text-gray-400 ring-1 ring-gray-500/30'
                        }`}
                    >
                        {isLive ? (
                            <>
                                <CircleDot
                                    size={10}
                                    className='animate-pulse'
                                />{' '}
                                LIVE
                            </>
                        ) : status === 'upcoming' ? (
                            <>
                                <Clock size={10} /> UPCOMING
                            </>
                        ) : (
                            <>
                                <CheckCircle2 size={10} /> ENDED
                            </>
                        )}
                    </span>
                    <span className='flex items-center gap-1 text-xs font-bold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-full ring-1 ring-amber-400/30'>
                        ₹{quiz.price}
                    </span>
                </div>

                {/* Title + Description */}
                <div>
                    <h3 className='text-gray-900 dark:text-white font-bold text-base line-clamp-2 leading-snug group-hover:text-indigo-600 dark:group-hover:text-indigo-300 transition-colors duration-200'>
                        {quiz.title}
                    </h3>
                    <p className='text-gray-500 dark:text-gray-400 text-xs mt-1 line-clamp-2 leading-relaxed'>
                        {quiz.description || 'No description provided.'}
                    </p>
                </div>

                {/* Prize pool */}
                {quiz.prizePool?.totalAmount > 0 && (
                    <div className='flex items-center gap-2 bg-amber-500/10 rounded-xl px-3 py-2'>
                        <Trophy size={13} className='text-amber-400 shrink-0' />
                        <span className='text-amber-300 text-xs font-semibold'>
                            Prize Pool: ₹{quiz.prizePool.totalAmount}
                        </span>
                    </div>
                )}

                {/* Stats row */}
                <div className='flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400'>
                    <span className='flex items-center gap-1.5'>
                        <Clock size={12} className='text-gray-500' />
                        {formatDuration(quiz.duration || quiz.timeLimit)}
                    </span>
                    <span className='flex items-center gap-1.5'>
                        <Users size={12} className='text-gray-500' />
                        {quiz.participantManagement?.participantCount || 0}{' '}
                        joined
                    </span>
                </div>

                {/* Countdown */}
                {countdown && (
                    <div className='flex items-center gap-2 text-xs font-mono bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2 border border-gray-100 dark:border-transparent'>
                        <Timer size={12} className='text-gray-400 shrink-0' />
                        <span className='text-gray-500 dark:text-gray-400'>
                            {status === 'upcoming' ? 'Starts in:' : 'Ends in:'}
                        </span>
                        <span className='font-bold text-gray-900 dark:text-white ml-auto'>
                            {countdown}
                        </span>
                    </div>
                )}

                {/* CTA */}
                <Link
                    to={`/quiz/${quiz._id}`}
                    className={`mt-auto flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-all duration-200 ${
                        isLive
                            ? 'bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-400 hover:to-emerald-400 text-white shadow-lg shadow-green-500/20'
                            : status === 'upcoming'
                              ? 'bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white shadow-lg shadow-indigo-500/20'
                              : 'bg-gray-700/80 hover:bg-gray-600/80 text-gray-300'
                    }`}
                >
                    {isLive ? (
                        <>
                            <Play size={13} /> Attempt Now
                        </>
                    ) : status === 'upcoming' ? (
                        <>
                            <Lock size={13} /> Register Now
                        </>
                    ) : (
                        <>
                            <Trophy size={13} /> View Results
                        </>
                    )}
                </Link>
            </div>
        </div>
    );
}

/* ────── Skeleton Card ────── */
function SkeletonCard() {
    return (
        <div className='rounded-2xl bg-gray-100 dark:bg-gray-800/60 overflow-hidden border border-gray-200 dark:border-transparent'>
            <div className='p-5 flex flex-col gap-3'>
                <div className='flex justify-between'>
                    <div className='h-6 w-20 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
                    <div className='h-6 w-14 bg-gray-200 dark:bg-gray-700 rounded-full animate-pulse' />
                </div>
                <div className='h-5 w-3/4 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                <div className='h-4 w-full bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                <div className='h-4 w-2/3 bg-gray-200 dark:bg-gray-700 rounded animate-pulse' />
                <div className='h-10 w-full bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse mt-2' />
            </div>
        </div>
    );
}

/* ────── War Room Chat Mock ────── */
function WarRoomMock() {
    const messages = [
        {
            name: 'Aria K.',
            text: 'Just got 8/10! 🔥',
            color: 'from-violet-500 to-indigo-500',
            side: 'left',
        },
        {
            name: 'You',
            text: 'Submitting answer...',
            color: 'from-cyan-500 to-blue-500',
            side: 'right',
        },
        {
            name: 'Ravi M.',
            text: 'Trick question! 😅',
            color: 'from-amber-500 to-orange-500',
            side: 'left',
        },
        {
            name: 'You',
            text: '✅ Correct! +10 pts',
            color: 'from-cyan-500 to-blue-500',
            side: 'right',
        },
    ];
    return (
        <div className='relative glass rounded-2xl p-4 max-w-xs w-full mx-auto'>
            <div className='flex items-center gap-2 mb-3 pb-3 border-b border-gray-200 dark:border-white/10'>
                <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                <span className='text-gray-900 dark:text-white text-sm font-bold'>
                    War Room #42
                </span>
                <span className='ml-auto text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1'>
                    <Users size={10} /> 12 live
                </span>
            </div>
            <div className='flex flex-col gap-2.5'>
                {messages.map((msg, i) => (
                    <div
                        key={i}
                        className={`flex items-start gap-2 ${msg.side === 'right' ? 'flex-row-reverse' : ''} animate-fade-in-up`}
                        style={{
                            animationDelay: `${i * 200}ms`,
                            opacity: 0,
                            animationFillMode: 'forwards',
                        }}
                    >
                        <div
                            className={`w-6 h-6 rounded-full bg-gradient-to-br ${msg.color} flex items-center justify-center text-white text-[9px] font-bold shrink-0`}
                        >
                            {msg.name.charAt(0)}
                        </div>
                        <div
                            className={`max-w-[75%] rounded-xl px-3 py-1.5 text-xs ${
                                msg.side === 'right'
                                    ? 'bg-indigo-600/90 text-white rounded-tr-sm'
                                    : 'bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-gray-200 rounded-tl-sm'
                            }`}
                        >
                            {msg.side === 'left' && (
                                <p className='text-[9px] font-semibold text-gray-400 mb-0.5'>
                                    {msg.name}
                                </p>
                            )}
                            {msg.text}
                        </div>
                    </div>
                ))}
            </div>
            <div className='mt-3 flex items-center gap-2 bg-gray-50 dark:bg-white/5 rounded-xl px-3 py-2'>
                <span className='text-xs text-gray-400 dark:text-gray-500 flex-1'>
                    Type your answer…
                </span>
                <div className='w-5 h-5 rounded-full bg-indigo-500 flex items-center justify-center'>
                    <ArrowRight size={10} className='text-white' />
                </div>
            </div>
        </div>
    );
}

/* ────── Main Home ────── */
export default function Home() {
    const [paidQuizzes, setPaidQuizzes] = useState([]);
    const [loadingPaid, setLoadingPaid] = useState(true);

    const fetchPaid = useCallback(async () => {
        try {
            const res = await QuizService.getPublicQuizzes({ isPaid: true });
            const list = (res.data.quizzes || []).filter((q) => q.isPaid);
            const order = { ongoing: 0, upcoming: 1, ended: 2 };
            list.sort(
                (a, b) =>
                    (order[getStatus(a)] ?? 3) - (order[getStatus(b)] ?? 3),
            );
            setPaidQuizzes(list.slice(0, 6));
        } catch {
            // silently ignore on home page
        } finally {
            setLoadingPaid(false);
        }
    }, []);

    useEffect(() => {
        fetchPaid();
    }, [fetchPaid]);

    return (
        <div className='bg-slate-50 dark:bg-[#0a0a14] min-h-screen overflow-x-hidden'>
            {/* ════════════════════════════════
                HERO
            ════════════════════════════════ */}
            <section className='relative min-h-[92vh] flex flex-col justify-center overflow-hidden'>
                {/* Background blobs */}
                <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute top-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full bg-indigo-500/15 dark:bg-indigo-600/20 blur-[120px] animate-blob' />
                    <div className='absolute bottom-[-5%] right-[-5%] w-[400px] h-[400px] rounded-full bg-violet-500/10 dark:bg-violet-700/20 blur-[100px] animate-blob delay-400' />
                    <div className='absolute top-[40%] right-[20%] w-[300px] h-[300px] rounded-full bg-pink-500/8 dark:bg-pink-600/10 blur-[80px] animate-blob delay-700' />
                    <div
                        className='absolute inset-0 opacity-[0.025] dark:opacity-[0.03]'
                        style={{
                            backgroundImage:
                                'linear-gradient(#6366f1 1px,transparent 1px),linear-gradient(90deg,#6366f1 1px,transparent 1px)',
                            backgroundSize: '60px 60px',
                        }}
                    />
                </div>

                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-20'>
                    <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
                        {/* Left: copy */}
                        <div className='flex-1 text-center lg:text-left space-y-6 animate-fade-in-up'>
                            <div className='inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-full px-4 py-1.5 text-sm text-indigo-600 dark:text-indigo-300'>
                                <Sparkles
                                    size={14}
                                    className='text-amber-500 dark:text-amber-400'
                                />
                                <span>Win Real Prize Money on Every Quiz</span>
                            </div>
                            <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white'>
                                Challenge Your Mind,{' '}
                                <br className='hidden sm:block' />
                                <span className='text-gradient'>
                                    Quiz Your Way
                                </span>{' '}
                                <br className='hidden sm:block' />
                                to Excellence
                            </h1>
                            <p className='text-base sm:text-lg text-gray-600 dark:text-gray-400 max-w-xl mx-auto lg:mx-0 leading-relaxed'>
                                Create AI-powered quizzes, compete in live War
                                Rooms, and win real cash prizes. Join 50,000+
                                players already on the arena.
                            </p>
                            <div className='flex flex-col sm:flex-row gap-3 justify-center lg:justify-start'>
                                <Link
                                    to='/create-quiz'
                                    className='group inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/30 transition-all duration-200 hover:-translate-y-0.5'
                                >
                                    <Sparkles size={16} />
                                    Create Quiz
                                    <ArrowRight
                                        size={16}
                                        className='group-hover:translate-x-1 transition-transform duration-200'
                                    />
                                </Link>
                                <Link
                                    to='/quizzes'
                                    className='inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl shadow-sm dark:shadow-none transition-all duration-200 hover:-translate-y-0.5'
                                >
                                    <Trophy
                                        size={16}
                                        className='text-amber-500 dark:text-amber-400'
                                    />
                                    Browse Quizzes
                                </Link>
                            </div>
                            {/* Social proof pills */}
                            <div className='flex flex-wrap items-center gap-3 justify-center lg:justify-start pt-2'>
                                {stats.map((s, i) => (
                                    <div
                                        key={i}
                                        className='flex items-center gap-1.5 bg-white dark:bg-white/5 border border-gray-200 dark:border-white/10 rounded-full px-3.5 py-1.5 shadow-sm dark:shadow-none'
                                    >
                                        <span className='text-gray-900 dark:text-white font-bold text-sm'>
                                            {s.value}
                                        </span>
                                        <span className='text-gray-500 dark:text-gray-400 text-xs'>
                                            {s.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: floating image */}
                        <div className='flex-1 flex justify-center lg:justify-end relative'>
                            <div className='relative w-full max-w-sm lg:max-w-md'>
                                <div className='absolute inset-0 bg-gradient-to-br from-indigo-500/30 to-violet-600/30 rounded-3xl blur-2xl scale-110' />
                                <img
                                    src={pic}
                                    alt='Quiz Arena'
                                    className='relative z-10 w-full rounded-3xl shadow-2xl shadow-indigo-900/50 animate-float-slow'
                                />
                                <div className='absolute -bottom-4 -left-4 z-20 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-float delay-200'>
                                    <div className='w-2 h-2 rounded-full bg-green-400 animate-pulse' />
                                    <span className='text-gray-900 dark:text-white text-xs font-semibold'>
                                        500+ Playing Now
                                    </span>
                                </div>
                                <div className='absolute -top-4 -right-4 z-20 glass rounded-2xl px-4 py-2.5 flex items-center gap-2 animate-float delay-500'>
                                    <Trophy
                                        size={14}
                                        className='text-amber-500 dark:text-amber-400'
                                    />
                                    <span className='text-gray-900 dark:text-white text-xs font-semibold'>
                                        ₹2L+ Paid Out
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom fade */}
                <div className='absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-slate-50 dark:from-[#0a0a14] to-transparent pointer-events-none' />
            </section>

            {/* ════════════════════════════════
                PRIZE QUIZZES
            ════════════════════════════════ */}
            {(loadingPaid || paidQuizzes.length > 0) && (
                <section className='py-20 bg-white dark:bg-[#0d0d1a]'>
                    <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                        <div className='flex items-end justify-between mb-10'>
                            <div>
                                <div className='flex items-center gap-2 mb-2'>
                                    <Trophy className='w-4 h-4 text-amber-400' />
                                    <span className='text-xs font-bold text-amber-400 uppercase tracking-[0.2em]'>
                                        Prize Competitions
                                    </span>
                                </div>
                                <h2 className='text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white'>
                                    Win Real{' '}
                                    <span className='text-gradient-amber'>
                                        Prize Money
                                    </span>
                                </h2>
                                <p className='text-gray-500 dark:text-gray-400 mt-1.5 text-sm'>
                                    Register, compete, and earn from our live
                                    prize pool quizzes
                                </p>
                            </div>
                            <Link
                                to='/quizzes'
                                className='hidden sm:flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold transition-colors'
                            >
                                View all <ChevronRight size={16} />
                            </Link>
                        </div>

                        {loadingPaid ? (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {[1, 2, 3].map((i) => (
                                    <SkeletonCard key={i} />
                                ))}
                            </div>
                        ) : (
                            <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5'>
                                {paidQuizzes.map((quiz) => (
                                    <PaidQuizCard key={quiz._id} quiz={quiz} />
                                ))}
                            </div>
                        )}

                        <div className='mt-8 sm:hidden text-center'>
                            <Link
                                to='/quizzes'
                                className='inline-flex items-center gap-1.5 text-sm text-amber-400 hover:text-amber-300 font-semibold'
                            >
                                View all quizzes <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </section>
            )}

            {/* ════════════════════════════════
                HOW IT WORKS
            ════════════════════════════════ */}
            <section className='py-20 bg-slate-50 dark:bg-[#0a0a14] relative overflow-hidden'>
                <div className='absolute inset-0 pointer-events-none'>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-200/40 dark:bg-indigo-900/15 blur-[100px]' />
                </div>
                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-14'>
                        <div className='inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-indigo-600 dark:text-indigo-300 mb-4'>
                            <Zap
                                size={12}
                                className='text-indigo-500 dark:text-indigo-400'
                            />
                            Get Started in Minutes
                        </div>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                            How It <span className='text-gradient'>Works</span>
                        </h2>
                        <p className='text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base'>
                            From discovery to prize collection — it takes just
                            three simple steps.
                        </p>
                    </div>

                    <div className='relative grid grid-cols-1 md:grid-cols-3 gap-8'>
                        <div className='hidden md:block absolute top-14 left-[calc(16.67%+1rem)] right-[calc(16.67%+1rem)] h-px border-t-2 border-dashed border-gray-200 dark:border-white/10 pointer-events-none' />
                        {howItWorks.map((item, i) => (
                            <div
                                key={i}
                                className='relative flex flex-col items-center text-center gap-4 animate-fade-in-up'
                                style={{
                                    animationDelay: `${i * 150}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                <div
                                    className={`relative z-10 w-14 h-14 rounded-2xl bg-gradient-to-br ${item.gradient} flex items-center justify-center shadow-lg`}
                                >
                                    <span className='text-white font-extrabold text-lg'>
                                        {item.step}
                                    </span>
                                </div>
                                <div>
                                    <h3 className='text-gray-900 dark:text-white font-bold text-lg mb-2'>
                                        {item.title}
                                    </h3>
                                    <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs mx-auto'>
                                        {item.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className='mt-12 text-center'>
                        <Link
                            to='/quizzes'
                            className='inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-400 hover:to-violet-500 text-white font-semibold rounded-xl shadow-lg shadow-indigo-500/25 transition-all duration-200 hover:-translate-y-0.5'
                        >
                            Start Playing Now <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                FEATURES
            ════════════════════════════════ */}
            <section className='py-20 bg-white dark:bg-[#0d0d1a]'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-14'>
                        <div className='inline-flex items-center gap-2 bg-violet-50 dark:bg-white/5 border border-violet-100 dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-violet-600 dark:text-violet-300 mb-4'>
                            <Sparkles
                                size={12}
                                className='text-violet-500 dark:text-violet-400'
                            />
                            Platform Features
                        </div>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                            Why Choose{' '}
                            <span className='text-gradient'>Quiz Arena?</span>
                        </h2>
                        <p className='text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base'>
                            Everything you need to create, compete, and win —
                            all in one place.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5'>
                        {features.map((feature, i) => {
                            const Icon = feature.icon;
                            return (
                                <div
                                    key={i}
                                    className='group relative glass rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1.5 hover:border-gray-200 dark:hover:border-white/20 transition-all duration-300 animate-fade-in-up'
                                    style={{
                                        animationDelay: `${i * 100}ms`,
                                        animationFillMode: 'both',
                                    }}
                                >
                                    <div
                                        className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg transition-transform duration-300 group-hover:scale-110`}
                                    >
                                        <Icon
                                            size={22}
                                            className='text-white'
                                        />
                                    </div>
                                    <div>
                                        <h3 className='text-gray-900 dark:text-white font-bold text-base mb-1.5'>
                                            {feature.title}
                                        </h3>
                                        <p className='text-gray-500 dark:text-gray-400 text-sm leading-relaxed'>
                                            {feature.description}
                                        </p>
                                    </div>
                                    <div
                                        className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none`}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                WAR ROOM SPOTLIGHT
            ════════════════════════════════ */}
            <section className='py-20 bg-slate-50 dark:bg-[#0a0a14] relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-rose-50/80 via-purple-50/50 to-indigo-50/60 dark:from-rose-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 pointer-events-none' />
                <div className='absolute top-0 right-0 w-[400px] h-[400px] rounded-full bg-rose-200/40 dark:bg-rose-600/10 blur-[100px] pointer-events-none' />

                <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='flex flex-col lg:flex-row items-center gap-12'>
                        {/* Left: text */}
                        <div className='flex-1 space-y-6 text-center lg:text-left'>
                            <div className='inline-flex items-center gap-2 bg-rose-50 dark:bg-rose-500/10 border border-rose-200 dark:border-rose-500/20 rounded-full px-4 py-1.5 text-xs text-rose-600 dark:text-rose-300'>
                                <div className='w-1.5 h-1.5 rounded-full bg-rose-500 dark:bg-rose-400 animate-pulse' />
                                Live Multiplayer
                            </div>
                            <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white leading-tight'>
                                Battle in Real-Time{' '}
                                <span className='text-gradient'>War Rooms</span>
                            </h2>
                            <p className='text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-lg mx-auto lg:mx-0'>
                                Create or join a War Room and challenge players
                                head-to-head with live scoring, real-time chat,
                                and instant rankings.
                            </p>
                            <ul className='space-y-2.5 text-sm text-gray-300'>
                                {[
                                    'Create a private or public room in seconds',
                                    'Real-time scoring and live leaderboard',
                                    'AI-suggested starter questions',
                                    'Chat and taunt your opponents mid-battle',
                                ].map((point, i) => (
                                    <li
                                        key={i}
                                        className='flex items-center gap-2.5 justify-center lg:justify-start text-gray-700 dark:text-gray-300'
                                    >
                                        <CheckCircle2
                                            size={15}
                                            className='text-rose-500 dark:text-rose-400 shrink-0'
                                        />
                                        {point}
                                    </li>
                                ))}
                            </ul>
                            <div className='pt-2 flex justify-center lg:justify-start'>
                                <Link
                                    to='/war-rooms'
                                    className='group inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-rose-500 to-pink-600 hover:from-rose-400 hover:to-pink-500 text-white font-semibold rounded-xl shadow-lg shadow-rose-500/25 transition-all duration-200 hover:-translate-y-0.5'
                                >
                                    <Sword size={16} />
                                    Enter War Room
                                    <ArrowRight
                                        size={15}
                                        className='group-hover:translate-x-1 transition-transform'
                                    />
                                </Link>
                            </div>
                        </div>

                        {/* Right: chat mock */}
                        <div className='flex-1 flex justify-center lg:justify-end'>
                            <div className='relative'>
                                <div className='absolute inset-0 bg-gradient-to-br from-rose-500/20 to-purple-600/20 rounded-3xl blur-2xl scale-110 pointer-events-none' />
                                <div className='relative animate-float-slow'>
                                    <WarRoomMock />
                                </div>
                                <div className='absolute -top-3 -right-3 glass rounded-xl px-3 py-2 flex items-center gap-1.5 animate-float delay-300'>
                                    <Trophy
                                        size={12}
                                        className='text-amber-500 dark:text-amber-400'
                                    />
                                    <span className='text-gray-900 dark:text-white text-xs font-bold'>
                                        +10 pts
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                TESTIMONIALS
            ════════════════════════════════ */}
            <section className='py-20 bg-slate-50 dark:bg-[#0d0d1a]'>
                <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
                    <div className='text-center mb-14'>
                        <div className='inline-flex items-center gap-2 bg-amber-50 dark:bg-white/5 border border-amber-100 dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-amber-600 dark:text-amber-300 mb-4'>
                            <Star
                                size={12}
                                className='text-amber-500 dark:text-amber-400'
                            />
                            Loved by Players
                        </div>
                        <h2 className='text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white'>
                            What Our{' '}
                            <span className='text-gradient'>Users Say</span>
                        </h2>
                        <p className='text-gray-500 dark:text-gray-400 mt-3 max-w-xl mx-auto text-sm sm:text-base'>
                            Thousands of students, educators and enthusiasts
                            love Quiz Arena.
                        </p>
                    </div>

                    <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                        {testimonials.map((t, i) => (
                            <div
                                key={i}
                                className='group glass rounded-2xl p-6 flex flex-col gap-4 hover:-translate-y-1 hover:border-gray-200 dark:hover:border-white/20 transition-all duration-300 animate-fade-in-up'
                                style={{
                                    animationDelay: `${i * 120}ms`,
                                    animationFillMode: 'both',
                                }}
                            >
                                <Quote
                                    size={28}
                                    className='text-indigo-400/40'
                                />
                                <div className='flex gap-1'>
                                    {Array.from({ length: t.stars }).map(
                                        (_, s) => (
                                            <Star
                                                key={s}
                                                size={13}
                                                className='text-amber-400 fill-amber-400'
                                            />
                                        ),
                                    )}
                                </div>
                                <p className='text-gray-600 dark:text-gray-300 text-sm leading-relaxed flex-1'>
                                    "{t.text}"
                                </p>
                                <div className='flex items-center gap-3 pt-2 border-t border-gray-100 dark:border-white/5'>
                                    <div
                                        className={`w-9 h-9 rounded-full bg-gradient-to-br ${t.avatarColor} flex items-center justify-center text-white font-bold text-sm shrink-0`}
                                    >
                                        {t.author.charAt(0)}
                                    </div>
                                    <div>
                                        <p className='text-gray-900 dark:text-white font-semibold text-sm'>
                                            {t.author}
                                        </p>
                                        <p className='text-gray-400 dark:text-gray-500 text-xs'>
                                            {t.role}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════
                CTA BANNER
            ════════════════════════════════ */}
            <section className='py-24 bg-white dark:bg-[#0a0a14] relative overflow-hidden'>
                <div className='absolute inset-0 bg-gradient-to-br from-indigo-50 via-violet-50/60 to-rose-50/50 dark:from-indigo-900/80 dark:via-violet-900/60 dark:to-rose-900/50 pointer-events-none' />
                <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] rounded-full bg-indigo-200/50 dark:bg-indigo-600/15 blur-[120px] pointer-events-none animate-blob' />
                <div className='absolute top-10 right-16 w-24 h-24 rounded-full border border-indigo-100 dark:border-white/5 animate-spin-slow pointer-events-none' />
                <div
                    className='absolute bottom-10 left-16 w-16 h-16 rounded-full border border-violet-100 dark:border-white/5 animate-spin-slow pointer-events-none'
                    style={{ animationDirection: 'reverse' }}
                />

                <div className='relative max-w-3xl mx-auto px-4 sm:px-6 text-center space-y-6'>
                    <div className='inline-flex items-center gap-2 bg-indigo-50 dark:bg-white/5 border border-indigo-100 dark:border-white/10 rounded-full px-4 py-1.5 text-xs text-indigo-600 dark:text-indigo-300'>
                        <Sparkles
                            size={12}
                            className='text-indigo-500 dark:text-indigo-400'
                        />
                        Free to Start — No Credit Card Required
                    </div>
                    <h2 className='text-4xl sm:text-5xl font-extrabold text-gray-900 dark:text-white leading-tight tracking-tight'>
                        Ready to Prove{' '}
                        <span className='text-gradient'>Your Brilliance?</span>
                    </h2>
                    <p className='text-gray-600 dark:text-gray-400 text-base sm:text-lg leading-relaxed'>
                        Join 50,000+ players who are already creating,
                        competing, and winning. Your next quiz — and your next
                        prize — is one click away.
                    </p>
                    <div className='flex flex-col sm:flex-row gap-4 justify-center pt-2'>
                        <Link
                            to='/quizzes'
                            className='group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-700 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 font-bold rounded-xl shadow-lg shadow-indigo-500/30 dark:shadow-white/10 transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base'
                        >
                            <Play
                                size={16}
                                className='text-white dark:text-indigo-600'
                            />
                            Start Playing Free
                            <ArrowRight
                                size={16}
                                className='text-white dark:text-gray-700 group-hover:translate-x-1 transition-transform'
                            />
                        </Link>
                        <Link
                            to='/about-us'
                            className='inline-flex items-center justify-center gap-2 px-8 py-4 bg-white dark:bg-white/5 hover:bg-gray-50 dark:hover:bg-white/10 border border-gray-200 dark:border-white/10 hover:border-gray-300 dark:hover:border-white/20 text-gray-800 dark:text-white font-semibold rounded-xl shadow-sm dark:shadow-none transition-all duration-200 hover:-translate-y-0.5 text-sm sm:text-base'
                        >
                            Learn More
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
