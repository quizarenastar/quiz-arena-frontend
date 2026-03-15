import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Trash2,
    Save,
    Eye,
    DollarSign,
    Calendar,
    X,
    Sparkles,
    Check,
    AlertCircle,
    Clock,
    BookOpen,
    ChevronRight,
    Zap,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';
import QuizTimingHelper from '../Components/QuizTimingHelper';

/* ─── Styles ─── */
const inp =
    'w-full px-4 py-2.5 bg-white dark:bg-[#1a1f2e] border border-[#e2e8f0] dark:border-[#2d3548] rounded-xl text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-400 transition-all';

const sectionCard =
    'bg-white dark:bg-[#141929] rounded-2xl border border-[#e8edf5] dark:border-[#1f2740] shadow-sm overflow-hidden';

/* ─── Toggle Switch ─── */
function Toggle({ checked, onChange }) {
    return (
        <button
            type='button'
            onClick={onChange}
            className={`relative w-11 h-6 rounded-full transition-all duration-300 focus:outline-none ${
                checked ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
        >
            <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-300 ${
                    checked ? 'translate-x-5' : 'translate-x-0'
                }`}
            />
        </button>
    );
}

/* ─── Section Header ─── */
function SectionHeader({ icon: Icon, title, subtitle, accent = 'indigo' }) {
    const accents = {
        indigo: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400',
        emerald:
            'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400',
        amber: 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400',
        purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400',
        rose: 'bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400',
    };
    return (
        <div className='flex items-center gap-3 px-6 py-4 border-b border-[#e8edf5] dark:border-[#1f2740]'>
            <div className={`p-2 rounded-xl ${accents[accent]}`}>
                <Icon size={16} />
            </div>
            <div>
                <h2 className='text-sm font-bold text-gray-900 dark:text-white'>
                    {title}
                </h2>
                {subtitle && (
                    <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    );
}

/* ─── AI Panel ─── */
function AIPanel({
    aiGeneration,
    setAiGeneration,
    onGenerate,
    generating,
    difficulties,
}) {
    return (
        <div className='flex flex-col gap-4'>
            <div className='text-center pb-2 border-b border-[#e8edf5] dark:border-[#1f2740]'>
                <div className='inline-flex items-center justify-center w-10 h-10 rounded-2xl bg-gradient-to-br from-purple-500 to-indigo-600 mb-3 shadow-lg shadow-purple-500/25'>
                    <Sparkles size={18} className='text-white' />
                </div>
                <h3 className='font-bold text-gray-900 dark:text-white text-sm'>
                    AI Generator
                </h3>
                <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                    Instant questions from any topic
                </p>
            </div>

            <div className='space-y-3'>
                <div>
                    <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide'>
                        Topic
                    </label>
                    <input
                        type='text'
                        value={aiGeneration.topic}
                        onChange={(e) =>
                            setAiGeneration((p) => ({
                                ...p,
                                topic: e.target.value,
                            }))
                        }
                        className={inp}
                        placeholder='e.g., JavaScript Closures'
                    />
                </div>

                <div className='grid grid-cols-2 gap-2.5'>
                    <div>
                        <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide'>
                            Count
                        </label>
                        <input
                            type='number'
                            value={aiGeneration.numberOfQuestions}
                            onChange={(e) =>
                                setAiGeneration((p) => ({
                                    ...p,
                                    numberOfQuestions: parseInt(e.target.value),
                                }))
                            }
                            className={inp}
                            min='1'
                            max='20'
                        />
                    </div>
                    <div>
                        <label className='block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wide'>
                            Level
                        </label>
                        <select
                            value={aiGeneration.difficultyLevel}
                            onChange={(e) =>
                                setAiGeneration((p) => ({
                                    ...p,
                                    difficultyLevel: e.target.value,
                                }))
                            }
                            className={inp}
                        >
                            {difficulties.map((d) => (
                                <option key={d.value} value={d.value}>
                                    {d.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <button
                onClick={onGenerate}
                disabled={generating || !aiGeneration.topic.trim()}
                className='flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-gray-300 disabled:to-gray-300 dark:disabled:from-gray-700 dark:disabled:to-gray-700 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 hover:-translate-y-0.5 active:translate-y-0 disabled:shadow-none disabled:translate-y-0'
            >
                {generating ? (
                    <>
                        <div className='w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin' />
                        Generating…
                    </>
                ) : (
                    <>
                        <Zap size={15} />
                        Generate Questions
                    </>
                )}
            </button>

            <p className='text-xs text-center text-gray-400 dark:text-gray-600'>
                Questions appear in your form — fully editable
            </p>
        </div>
    );
}

/* ─── Difficulty Badge ─── */
const difficultyConfig = {
    easy: {
        color: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
        dot: 'bg-emerald-500',
    },
    medium: {
        color: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
        dot: 'bg-amber-500',
    },
    hard: {
        color: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400',
        dot: 'bg-rose-500',
    },
};

/* ─── Main Component ─── */
const CreateQuiz = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editQuizId = searchParams.get('edit');
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [showAiModal, setShowAiModal] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        topic: '',
        category: '',
        difficultyLevel: 'easy',
        isPaid: false,
        price: 0,
        timeLimit: 300,
        startTime: '',
        endTime: '',
        settings: {
            shuffleQuestions: false,
            shuffleOptions: false,
            showCorrectAnswers: true,
            allowReview: true,
            antiCheat: {
                enabled: false,
                detectTabSwitch: false,
                detectCopyPaste: false,
                timeLimit: false,
                randomizeQuestions: false,
            },
        },
        questions: [],
    });

    const [aiGeneration, setAiGeneration] = useState({
        topic: '',
        numberOfQuestions: 5,
        difficultyLevel: 'easy',
    });

    const categories = [
        'technology',
        'science',
        'history',
        'geography',
        'mathematics',
        'literature',
        'sports',
        'entertainment',
        'business',
        'general knowledge',
    ];

    const difficulties = [
        { value: 'easy', label: 'Easy' },
        { value: 'medium', label: 'Medium' },
        { value: 'hard', label: 'Hard' },
    ];

    /* ─── Load for edit ─── */
    useEffect(() => {
        if (!editQuizId) return;
        const load = async () => {
            try {
                setLoading(true);
                const response = await QuizService.getQuiz(editQuizId);
                const quizData = response.data.quiz;
                const questions =
                    response.data.questions || quizData.questions || [];

                const transformedQuestions = questions.map((q, i) => ({
                    id: Date.now() + i,
                    text: q.question || q.text || '',
                    type:
                        q.type === 'mcq'
                            ? 'multiple-choice'
                            : q.type || 'multiple-choice',
                    options: q.options || ['', '', '', ''],
                    correctAnswer:
                        q.correctAnswer !== undefined ? q.correctAnswer : 0,
                    explanation: q.explanation || '',
                    points: q.points || 1,
                    timeLimit: q.timeLimit || 30,
                }));

                setQuiz({
                    _id: quizData._id,
                    title: quizData.title || '',
                    description: quizData.description || '',
                    topic: quizData.topic || '',
                    category: quizData.category || '',
                    difficultyLevel:
                        quizData.difficultyLevel ||
                        quizData.difficulty ||
                        'easy',
                    isPaid: quizData.isPaid || false,
                    price: quizData.price || 0,
                    timeLimit: quizData.timeLimit || quizData.duration || 300,
                    startTime: quizData.startTime
                        ? new Date(quizData.startTime)
                              .toISOString()
                              .slice(0, 16)
                        : '',
                    endTime: quizData.endTime
                        ? new Date(quizData.endTime).toISOString().slice(0, 16)
                        : '',
                    settings: quizData.settings || quiz.settings,
                    questions: transformedQuestions,
                });
                setIsEditMode(true);
                toast.success(
                    `Loaded: ${transformedQuestions.length} questions`,
                );
            } catch (error) {
                toast.error(error.message || 'Failed to load quiz');
                navigate('/my-quizzes');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [editQuizId, navigate]);

    /* ─── Handlers ─── */
    const handleQuizChange = (field, value) =>
        setQuiz((p) => ({ ...p, [field]: value }));

    const addQuestion = () => {
        setQuiz((p) => ({
            ...p,
            questions: [
                ...p.questions,
                {
                    id: Date.now(),
                    text: '',
                    type: 'multiple-choice',
                    options: ['', '', '', ''],
                    correctAnswer: 0,
                    explanation: '',
                    points: 1,
                    timeLimit: 30,
                },
            ],
        }));
    };

    const updateQuestion = (i, field, value) =>
        setQuiz((p) => ({
            ...p,
            questions: p.questions.map((q, j) =>
                j === i ? { ...q, [field]: value } : q,
            ),
        }));

    const updateQuestionOption = (qi, oi, value) =>
        setQuiz((p) => ({
            ...p,
            questions: p.questions.map((q, i) =>
                i === qi
                    ? {
                          ...q,
                          options: q.options.map((o, j) =>
                              j === oi ? value : o,
                          ),
                      }
                    : q,
            ),
        }));

    const deleteQuestion = (i) =>
        setQuiz((p) => ({
            ...p,
            questions: p.questions.filter((_, j) => j !== i),
        }));

    /* ─── AI Generation ─── */
    const generateQuestionsWithAI = async () => {
        if (!aiGeneration.topic.trim()) {
            toast.error('Please enter a topic for AI generation');
            return;
        }
        setAiGenerating(true);
        try {
            const result = await QuizService.generateQuestionsPreview({
                topic: aiGeneration.topic,
                numQuestions: aiGeneration.numberOfQuestions,
                difficulty: aiGeneration.difficultyLevel,
            });

            const formatted = (result.data.questions || []).map((q, i) => ({
                id: Date.now() + i,
                text: q.question,
                type: 'multiple-choice',
                options: q.options,
                correctAnswer: q.correctAnswer,
                explanation: q.explanation || '',
                points: 1,
                timeLimit: 30,
            }));

            setQuiz((p) => ({
                ...p,
                title:
                    result.data.suggestedTitle ||
                    p.title ||
                    `${aiGeneration.topic} Quiz`,
                description:
                    result.data.suggestedDescription ||
                    p.description ||
                    `A quiz about ${aiGeneration.topic}`,
                topic: aiGeneration.topic,
                category:
                    result.data.suggestedCategory ||
                    p.category ||
                    'general-knowledge',
                difficultyLevel: aiGeneration.difficultyLevel,
                questions: formatted,
            }));

            setShowAiModal(false);
            toast.success(`✨ Generated ${formatted.length} questions!`);
        } catch (error) {
            toast.error(error.message || 'Failed to generate questions');
        } finally {
            setAiGenerating(false);
        }
    };

    /* ─── Save ─── */
    const saveQuiz = async () => {
        if (!quiz.title.trim()) {
            toast.error('Please enter a quiz title');
            return;
        }
        if (quiz.questions.length === 0) {
            toast.error('Please add at least one question');
            return;
        }
        if (!quiz.startTime) {
            toast.error('Start time is required');
            return;
        }
        if (!quiz.endTime) {
            toast.error('End time is required');
            return;
        }

        const start = new Date(quiz.startTime);
        const end = new Date(quiz.endTime);
        if (start >= end) {
            toast.error('End time must be after start time');
            return;
        }

        setLoading(true);
        try {
            const quizData = {
                title: quiz.title,
                description: quiz.description,
                topic: quiz.topic || quiz.title,
                category: quiz.category || 'general-knowledge',
                difficultyLevel: quiz.difficultyLevel,
                isPaid: quiz.isPaid,
                price: quiz.isPaid ? quiz.price : 0,
                timeLimit: quiz.timeLimit,
                startTime: quiz.startTime,
                endTime: quiz.endTime,
                settings: quiz.settings,
                questions: quiz.questions.map((q) => ({
                    question: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    type: q.type || 'multiple-choice',
                    points: q.points || 1,
                    timeLimit: q.timeLimit || 30,
                })),
            };

            if (quiz._id) {
                await QuizService.updateQuiz(quiz._id, quizData);
                toast.success('Quiz updated successfully!');
            } else {
            const result = await QuizService.createQuiz(quizData);
                setQuiz((p) => ({ ...p, _id: result.data.quiz._id }));
                const aiReview = result.data?.aiReview;
                if (aiReview?.approved) {
                    toast.success(`Quiz approved automatically! (Quality score: ${aiReview.score}/100)`);
                } else {
                    toast.success('Quiz submitted for review — our AI will assess it shortly');
                }
                navigate('/my-quizzes');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save quiz');
        } finally {
            setLoading(false);
        }
    };

    if (loading && editQuizId) {
        return (
            <div className='min-h-screen bg-[#f5f7fc] dark:bg-[#0d1117] flex items-center justify-center'>
                <div className='text-center'>
                    <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse mx-auto mb-4' />
                    <p className='text-sm text-gray-500 dark:text-gray-400'>
                        Loading quiz…
                    </p>
                </div>
            </div>
        );
    }

    const totalPoints = quiz.questions.reduce((s, q) => s + (q.points || 1), 0);

    return (
        <div className='min-h-screen bg-[#f5f7fc] dark:bg-[#0d1117]'>
            {/* ── Top bar ── */}
            <div className='sticky top-0 z-30 bg-white/80 dark:bg-[#0d1117]/90 backdrop-blur-md border-b border-[#e8edf5] dark:border-[#1f2740] px-5 py-3'>
                <div className='max-w-screen-xl mx-auto flex items-center justify-between gap-3'>
                    <div className='flex items-center gap-3'>
                        <div className='w-8 h-8 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/25'>
                            <BookOpen size={14} className='text-white' />
                        </div>
                        <div>
                            <h1 className='text-sm font-bold text-gray-900 dark:text-white'>
                                {isEditMode ? 'Edit Quiz' : 'Create Quiz'}
                            </h1>
                            {quiz.questions.length > 0 && (
                                <p className='text-xs text-gray-400 dark:text-gray-500'>
                                    {quiz.questions.length} question
                                    {quiz.questions.length !== 1 ? 's' : ''} ·{' '}
                                    {totalPoints} pts
                                </p>
                            )}
                        </div>
                    </div>

                    <div className='flex items-center gap-2'>
                        <button
                            onClick={() => setShowAiModal(true)}
                            className='lg:hidden flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20'
                        >
                            <Sparkles size={13} />
                            AI
                        </button>
                        <button
                            onClick={() => setShowPreview(true)}
                            disabled={quiz.questions.length === 0}
                            className='flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#e2e8f0] dark:border-[#2d3548] text-gray-600 dark:text-gray-300 text-xs font-semibold hover:bg-gray-50 dark:hover:bg-[#1a1f2e] disabled:opacity-40 transition-all'
                        >
                            <Eye size={13} />
                            Preview
                        </button>
                        <button
                            onClick={saveQuiz}
                            disabled={loading}
                            className='flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 text-white text-xs font-bold shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:shadow-none'
                        >
                            <Save size={13} />
                            {loading
                                ? 'Saving…'
                                : isEditMode
                                  ? 'Update'
                                  : 'Save Quiz'}
                        </button>
                    </div>
                </div>
            </div>

            {/* ── Body ── */}
            <div className='max-w-screen-xl mx-auto px-4 py-6 lg:flex lg:gap-6 lg:items-start'>
                {/* ══ LEFT: Main form ══ */}
                <div className='flex-1 min-w-0 space-y-4'>
                    {/* ── Quiz Details ── */}
                    <div className={sectionCard}>
                        <SectionHeader
                            icon={BookOpen}
                            title='Quiz Details'
                            subtitle='Basic info about your quiz'
                            accent='indigo'
                        />
                        <div className='p-6 space-y-5'>
                            <div>
                                <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                    Quiz Title{' '}
                                    <span className='text-rose-400'>*</span>
                                </label>
                                <input
                                    type='text'
                                    value={quiz.title}
                                    onChange={(e) =>
                                        handleQuizChange(
                                            'title',
                                            e.target.value,
                                        )
                                    }
                                    className={`${inp} text-base font-semibold`}
                                    placeholder='Give your quiz a great title'
                                />
                            </div>

                            <div>
                                <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                    Description
                                </label>
                                <textarea
                                    value={quiz.description}
                                    onChange={(e) =>
                                        handleQuizChange(
                                            'description',
                                            e.target.value,
                                        )
                                    }
                                    rows={3}
                                    className={inp}
                                    placeholder='What will participants learn or be tested on?'
                                />
                            </div>

                            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4'>
                                <div>
                                    <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                        Category
                                    </label>
                                    <select
                                        value={quiz.category}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'category',
                                                e.target.value,
                                            )
                                        }
                                        className={inp}
                                    >
                                        <option value=''>
                                            Select category
                                        </option>
                                        {categories.map((c) => (
                                            <option key={c} value={c}>
                                                {c}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                        Difficulty
                                    </label>
                                    <div className='flex gap-2'>
                                        {difficulties.map((d) => {
                                            const cfg =
                                                difficultyConfig[d.value];
                                            const active =
                                                quiz.difficultyLevel ===
                                                d.value;
                                            return (
                                                <button
                                                    key={d.value}
                                                    type='button'
                                                    onClick={() =>
                                                        handleQuizChange(
                                                            'difficultyLevel',
                                                            d.value,
                                                        )
                                                    }
                                                    className={`flex-1 py-2 rounded-xl text-xs font-bold border-2 transition-all ${
                                                        active
                                                            ? `${cfg.color} border-current`
                                                            : 'bg-gray-50 dark:bg-[#1a1f2e] text-gray-400 dark:text-gray-600 border-transparent hover:border-gray-200 dark:hover:border-gray-700'
                                                    }`}
                                                >
                                                    {d.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                <div>
                                    <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                        Duration (seconds)
                                    </label>
                                    <input
                                        type='number'
                                        value={quiz.timeLimit}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'timeLimit',
                                                parseInt(e.target.value),
                                            )
                                        }
                                        className={inp}
                                        min='10'
                                        step='10'
                                    />
                                    {quiz.timeLimit >= 60 && (
                                        <p className='text-xs text-indigo-500 dark:text-indigo-400 mt-1.5 font-medium'>
                                            = {Math.floor(quiz.timeLimit / 60)}m{' '}
                                            {quiz.timeLimit % 60 > 0
                                                ? `${quiz.timeLimit % 60}s`
                                                : ''}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <QuizTimingHelper
                                questions={quiz.questions}
                                totalDuration={quiz.timeLimit}
                                onTotalDurationChange={(d) =>
                                    handleQuizChange('timeLimit', d)
                                }
                                onQuestionsUpdate={(qs) =>
                                    setQuiz({ ...quiz, questions: qs })
                                }
                            />
                        </div>
                    </div>

                    {/* ── Schedule ── */}
                    <div className={sectionCard}>
                        <SectionHeader
                            icon={Calendar}
                            title='Schedule'
                            subtitle='When is your quiz available?'
                            accent='emerald'
                        />
                        <div className='p-6 space-y-4'>
                            <div className='flex items-start gap-3 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/50'>
                                <AlertCircle
                                    size={15}
                                    className='text-indigo-500 mt-0.5 flex-shrink-0'
                                />
                                <p className='text-xs text-indigo-700 dark:text-indigo-300 leading-relaxed'>
                                    All quizzes need a start and end time. Free
                                    quizzes open automatically; paid quizzes
                                    require pre-registration.
                                </p>
                            </div>

                            {quiz.isPaid && (
                                <div className='flex items-start gap-3 p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50'>
                                    <AlertCircle
                                        size={15}
                                        className='text-amber-500 mt-0.5 flex-shrink-0'
                                    />
                                    <p className='text-xs text-amber-700 dark:text-amber-300 leading-relaxed'>
                                        <strong>Prize Pool:</strong>{' '}
                                        Registration closes at start time.
                                        Prizes distributed after end.
                                        Auto-cancels if fewer than 5
                                        participants.
                                    </p>
                                </div>
                            )}

                            <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                        Start Time{' '}
                                        <span className='text-rose-400'>*</span>
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={quiz.startTime}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'startTime',
                                                e.target.value,
                                            )
                                        }
                                        className={inp}
                                    />
                                    <p className='text-xs text-gray-400 dark:text-gray-600 mt-1.5'>
                                        Quiz opens for attempts
                                    </p>
                                </div>
                                <div>
                                    <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                        End Time{' '}
                                        <span className='text-rose-400'>*</span>
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={quiz.endTime}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'endTime',
                                                e.target.value,
                                            )
                                        }
                                        className={inp}
                                    />
                                    <p className='text-xs text-gray-400 dark:text-gray-600 mt-1.5'>
                                        {quiz.isPaid
                                            ? 'Prizes distributed after this'
                                            : 'Quiz closes at this time'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* ── Pricing ── */}
                    <div className={sectionCard}>
                        <div className='p-5'>
                            <div className='flex items-center justify-between'>
                                <div className='flex items-center gap-3'>
                                    <div className='p-2 rounded-xl bg-amber-50 dark:bg-amber-900/20'>
                                        <DollarSign
                                            size={16}
                                            className='text-amber-600 dark:text-amber-400'
                                        />
                                    </div>
                                    <div>
                                        <p className='text-sm font-bold text-gray-800 dark:text-white'>
                                            Paid Quiz
                                        </p>
                                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                                            Charge participants an entry fee
                                        </p>
                                    </div>
                                </div>
                                <Toggle
                                    checked={quiz.isPaid}
                                    onChange={() =>
                                        handleQuizChange('isPaid', !quiz.isPaid)
                                    }
                                />
                            </div>

                            {quiz.isPaid && (
                                <div className='mt-4 pt-4 border-t border-[#e8edf5] dark:border-[#1f2740] flex items-center gap-3'>
                                    <div className='flex-1'>
                                        <label className='block text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2'>
                                            Entry Fee
                                        </label>
                                        <div className='relative'>
                                            <span className='absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400'>
                                                ₹
                                            </span>
                                            <input
                                                type='number'
                                                value={quiz.price}
                                                onChange={(e) =>
                                                    handleQuizChange(
                                                        'price',
                                                        parseFloat(
                                                            e.target.value,
                                                        ),
                                                    )
                                                }
                                                className={`${inp} pl-8`}
                                                placeholder='0'
                                                min='0'
                                                step='1'
                                            />
                                        </div>
                                    </div>
                                    <div className='flex-1 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-100 dark:border-amber-900/50'>
                                        <p className='text-xs text-amber-700 dark:text-amber-300'>
                                            <strong>Prize pool</strong>{' '}
                                            collected from entry fees and
                                            distributed to top performers.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Questions ── */}
                    <div className={sectionCard}>
                        <div className='flex items-center justify-between px-6 py-4 border-b border-[#e8edf5] dark:border-[#1f2740]'>
                            <div className='flex items-center gap-3'>
                                <div className='p-2 rounded-xl bg-purple-50 dark:bg-purple-900/20'>
                                    <BookOpen
                                        size={16}
                                        className='text-purple-600 dark:text-purple-400'
                                    />
                                </div>
                                <div>
                                    <h2 className='text-sm font-bold text-gray-900 dark:text-white'>
                                        Questions
                                    </h2>
                                    {quiz.questions.length > 0 && (
                                        <p className='text-xs text-gray-400 dark:text-gray-500 mt-0.5'>
                                            {quiz.questions.length} added ·{' '}
                                            {totalPoints} total pts
                                        </p>
                                    )}
                                </div>
                            </div>
                            <button
                                onClick={addQuestion}
                                className='flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-emerald-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0'
                            >
                                <Plus size={13} />
                                Add Question
                            </button>
                        </div>

                        <div className='p-5'>
                            {quiz.questions.length === 0 ? (
                                <div className='text-center py-16'>
                                    <div className='w-16 h-16 rounded-2xl bg-gray-100 dark:bg-[#1a1f2e] flex items-center justify-center mx-auto mb-4'>
                                        <BookOpen
                                            size={24}
                                            className='text-gray-300 dark:text-gray-600'
                                        />
                                    </div>
                                    <p className='text-sm font-semibold text-gray-400 dark:text-gray-500'>
                                        No questions yet
                                    </p>
                                    <p className='text-xs text-gray-300 dark:text-gray-600 mt-1'>
                                        Add manually or generate with AI
                                    </p>
                                    <div className='flex items-center justify-center gap-3 mt-5'>
                                        <button
                                            onClick={addQuestion}
                                            className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gray-100 dark:bg-[#1a1f2e] hover:bg-gray-200 dark:hover:bg-[#222840] text-gray-600 dark:text-gray-400 text-xs font-semibold transition-all'
                                        >
                                            <Plus size={13} />
                                            Add Manually
                                        </button>
                                        <button
                                            onClick={() => setShowAiModal(true)}
                                            className='flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs font-bold shadow-lg shadow-purple-500/20 transition-all hover:-translate-y-0.5'
                                        >
                                            <Sparkles size={13} />
                                            Generate with AI
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className='space-y-3'>
                                    {quiz.questions.map((question, qi) => (
                                        <div
                                            key={question.id}
                                            className='group border border-[#e8edf5] dark:border-[#1f2740] rounded-2xl overflow-hidden hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all'
                                        >
                                            {/* Question header */}
                                            <div className='flex items-center justify-between px-4 py-3 bg-gray-50 dark:bg-[#1a1f2e] border-b border-[#e8edf5] dark:border-[#1f2740]'>
                                                <div className='flex items-center gap-2'>
                                                    <span className='w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold'>
                                                        {qi + 1}
                                                    </span>
                                                    <span className='text-xs text-gray-400 dark:text-gray-500 font-medium'>
                                                        Multiple Choice
                                                    </span>
                                                </div>
                                                <button
                                                    onClick={() =>
                                                        deleteQuestion(qi)
                                                    }
                                                    className='opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-all'
                                                >
                                                    <Trash2 size={13} />
                                                </button>
                                            </div>

                                            <div className='p-4 space-y-4'>
                                                <textarea
                                                    value={question.text}
                                                    onChange={(e) =>
                                                        updateQuestion(
                                                            qi,
                                                            'text',
                                                            e.target.value,
                                                        )
                                                    }
                                                    rows={2}
                                                    className={`${inp} resize-none`}
                                                    placeholder='Type your question here…'
                                                />

                                                {/* Options */}
                                                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2.5'>
                                                    {question.options.map(
                                                        (option, oi) => {
                                                            const isCorrect =
                                                                question.correctAnswer ===
                                                                oi;
                                                            return (
                                                                <div
                                                                    key={oi}
                                                                    className={`flex items-center gap-2.5 p-2.5 rounded-xl border-2 transition-all ${
                                                                        isCorrect
                                                                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 dark:border-emerald-700'
                                                                            : 'border-[#e8edf5] dark:border-[#2d3548] hover:border-gray-300 dark:hover:border-gray-600'
                                                                    }`}
                                                                >
                                                                    <button
                                                                        type='button'
                                                                        onClick={() =>
                                                                            updateQuestion(
                                                                                qi,
                                                                                'correctAnswer',
                                                                                oi,
                                                                            )
                                                                        }
                                                                        className={`flex-shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                                                            isCorrect
                                                                                ? 'border-emerald-500 bg-emerald-500'
                                                                                : 'border-gray-300 dark:border-gray-600 hover:border-emerald-400'
                                                                        }`}
                                                                    >
                                                                        {isCorrect && (
                                                                            <Check
                                                                                size={
                                                                                    10
                                                                                }
                                                                                className='text-white'
                                                                            />
                                                                        )}
                                                                    </button>
                                                                    <input
                                                                        type='text'
                                                                        value={
                                                                            option
                                                                        }
                                                                        onChange={(
                                                                            e,
                                                                        ) =>
                                                                            updateQuestionOption(
                                                                                qi,
                                                                                oi,
                                                                                e
                                                                                    .target
                                                                                    .value,
                                                                            )
                                                                        }
                                                                        className={`flex-1 text-sm bg-transparent border-0 outline-none focus:ring-0 placeholder-gray-400 ${
                                                                            isCorrect
                                                                                ? 'text-emerald-800 dark:text-emerald-300 font-semibold'
                                                                                : 'text-gray-700 dark:text-gray-300'
                                                                        }`}
                                                                        placeholder={`Option ${oi + 1}`}
                                                                    />
                                                                    <span className='flex-shrink-0 text-xs font-bold text-gray-300 dark:text-gray-700'>
                                                                        {String.fromCharCode(
                                                                            65 +
                                                                                oi,
                                                                        )}
                                                                    </span>
                                                                </div>
                                                            );
                                                        },
                                                    )}
                                                </div>

                                                {/* Meta row */}
                                                <div className='flex gap-3 items-end'>
                                                    <div className='w-24'>
                                                        <label className='block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5'>
                                                            Points
                                                        </label>
                                                        <input
                                                            type='number'
                                                            value={
                                                                question.points
                                                            }
                                                            onChange={(e) =>
                                                                updateQuestion(
                                                                    qi,
                                                                    'points',
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className={inp}
                                                            min='1'
                                                        />
                                                    </div>
                                                    <div className='w-28'>
                                                        <label className='block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5'>
                                                            Time (s)
                                                        </label>
                                                        <input
                                                            type='number'
                                                            value={
                                                                question.timeLimit ||
                                                                30
                                                            }
                                                            onChange={(e) =>
                                                                updateQuestion(
                                                                    qi,
                                                                    'timeLimit',
                                                                    parseInt(
                                                                        e.target
                                                                            .value,
                                                                    ),
                                                                )
                                                            }
                                                            className={inp}
                                                            min='10'
                                                        />
                                                    </div>
                                                    <div className='flex-1'>
                                                        <label className='block text-xs font-bold text-gray-400 dark:text-gray-600 uppercase tracking-wide mb-1.5'>
                                                            Explanation
                                                            (optional)
                                                        </label>
                                                        <input
                                                            type='text'
                                                            value={
                                                                question.explanation
                                                            }
                                                            onChange={(e) =>
                                                                updateQuestion(
                                                                    qi,
                                                                    'explanation',
                                                                    e.target
                                                                        .value,
                                                                )
                                                            }
                                                            className={inp}
                                                            placeholder='Why is this the correct answer?'
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {/* Add more button */}
                                    <button
                                        onClick={addQuestion}
                                        className='w-full py-3 border-2 border-dashed border-[#e8edf5] dark:border-[#2d3548] rounded-2xl text-xs font-semibold text-gray-400 dark:text-gray-600 hover:border-indigo-300 dark:hover:border-indigo-800 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/10 transition-all flex items-center justify-center gap-2'
                                    >
                                        <Plus size={14} />
                                        Add Another Question
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── Action Buttons ── */}
                    <div className='flex items-center gap-3 pb-8'>
                        <button
                            onClick={saveQuiz}
                            disabled={loading}
                            className='flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-gray-400 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:shadow-none'
                        >
                            <Save size={15} />
                            {loading
                                ? 'Saving…'
                                : isEditMode
                                  ? 'Update Quiz'
                                  : 'Save Quiz'}
                        </button>
                        <button
                            onClick={() => navigate('/my-quizzes')}
                            className='px-5 py-2.5 bg-white dark:bg-[#1a1f2e] border border-[#e2e8f0] dark:border-[#2d3548] hover:bg-gray-50 dark:hover:bg-[#222840] text-gray-600 dark:text-gray-400 rounded-xl font-semibold text-sm transition-all'
                        >
                            Cancel
                        </button>
                    </div>
                </div>

                {/* ══ RIGHT: AI Panel ══ */}
                <div className='hidden lg:block w-72 flex-shrink-0'>
                    <div className='sticky top-20 space-y-4'>
                        <div className={`${sectionCard} p-5`}>
                            <AIPanel
                                aiGeneration={aiGeneration}
                                setAiGeneration={setAiGeneration}
                                onGenerate={generateQuestionsWithAI}
                                generating={aiGenerating}
                                difficulties={difficulties}
                            />
                        </div>

                        {/* Summary card */}
                        {quiz.questions.length > 0 && (
                            <div className={`${sectionCard} p-5`}>
                                <p className='text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-widest mb-4'>
                                    Summary
                                </p>
                                <div className='space-y-3'>
                                    {[
                                        {
                                            label: 'Questions',
                                            value: quiz.questions.length,
                                            icon: BookOpen,
                                        },
                                        {
                                            label: 'Total Points',
                                            value: totalPoints,
                                            icon: Zap,
                                        },
                                        {
                                            label: 'Duration',
                                            value: `${Math.floor(quiz.timeLimit / 60)}m${quiz.timeLimit % 60 ? ` ${quiz.timeLimit % 60}s` : ''}`,
                                            icon: Clock,
                                        },
                                    ].map(({ label, value, icon: Icon }) => (
                                        <div
                                            key={label}
                                            className='flex items-center justify-between'
                                        >
                                            <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                                                <Icon size={13} />
                                                <span className='text-xs'>
                                                    {label}
                                                </span>
                                            </div>
                                            <span className='text-sm font-bold text-gray-800 dark:text-white'>
                                                {value}
                                            </span>
                                        </div>
                                    ))}

                                    <div className='flex items-center justify-between pt-2 border-t border-[#e8edf5] dark:border-[#1f2740]'>
                                        <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                                            <Calendar size={13} />
                                            <span className='text-xs'>
                                                Schedule
                                            </span>
                                        </div>
                                        {quiz.startTime && quiz.endTime ? (
                                            <span className='flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-xs font-bold'>
                                                <Check size={12} />
                                                Set
                                            </span>
                                        ) : (
                                            <span className='text-rose-400 text-xs font-bold'>
                                                Required
                                            </span>
                                        )}
                                    </div>

                                    {quiz.difficultyLevel && (
                                        <div className='flex items-center justify-between'>
                                            <div className='flex items-center gap-2 text-gray-500 dark:text-gray-400'>
                                                <span className='text-xs'>
                                                    Difficulty
                                                </span>
                                            </div>
                                            <span
                                                className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-bold ${difficultyConfig[quiz.difficultyLevel]?.color}`}
                                            >
                                                <span
                                                    className={`w-1.5 h-1.5 rounded-full ${difficultyConfig[quiz.difficultyLevel]?.dot}`}
                                                />
                                                {quiz.difficultyLevel}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Quick tips */}
                        <div className='p-4 rounded-2xl bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 border border-indigo-100 dark:border-indigo-900/40'>
                            <p className='text-xs font-bold text-indigo-700 dark:text-indigo-300 mb-3 uppercase tracking-wide'>
                                Tips
                            </p>
                            <ul className='space-y-2'>
                                {[
                                    'Use AI to quickly draft questions',
                                    'Mark the correct answer for each question',
                                    'Add explanations to improve learning',
                                ].map((tip, i) => (
                                    <li
                                        key={i}
                                        className='flex items-start gap-2 text-xs text-indigo-600 dark:text-indigo-400'
                                    >
                                        <ChevronRight
                                            size={12}
                                            className='mt-0.5 flex-shrink-0 opacity-60'
                                        />
                                        {tip}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── AI Modal (mobile) ── */}
            {showAiModal && (
                <div
                    className='fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm lg:hidden'
                    onClick={(e) =>
                        e.target === e.currentTarget && setShowAiModal(false)
                    }
                >
                    <div className='bg-white dark:bg-[#141929] rounded-2xl shadow-2xl w-full max-w-md p-6 border border-[#e8edf5] dark:border-[#1f2740]'>
                        <div className='flex items-center justify-between mb-5'>
                            <span className='font-bold text-gray-900 dark:text-white'>
                                AI Question Generator
                            </span>
                            <button
                                onClick={() => setShowAiModal(false)}
                                className='p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-[#1a1f2e] transition-all'
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <AIPanel
                            aiGeneration={aiGeneration}
                            setAiGeneration={setAiGeneration}
                            onGenerate={generateQuestionsWithAI}
                            generating={aiGenerating}
                            difficulties={difficulties}
                        />
                    </div>
                </div>
            )}

            {/* ── Preview Modal ── */}
            {showPreview && (
                <div className='fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4'>
                    <div className='bg-white dark:bg-[#0d1117] rounded-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl border border-[#e8edf5] dark:border-[#1f2740]'>
                        <div className='bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h2 className='text-lg font-bold mb-1'>
                                        {quiz.title || 'Untitled Quiz'}
                                    </h2>
                                    <p className='text-indigo-200 text-sm'>
                                        {quiz.description || 'No description'}
                                    </p>
                                    <div className='flex flex-wrap gap-2 mt-3'>
                                        {quiz.category && (
                                            <span className='bg-white/15 text-xs px-2.5 py-1 rounded-lg font-medium'>
                                                {quiz.category}
                                            </span>
                                        )}
                                        <span
                                            className={`text-xs px-2.5 py-1 rounded-lg font-bold bg-white/15`}
                                        >
                                            {quiz.difficultyLevel}
                                        </span>
                                        <span className='bg-white/15 text-xs px-2.5 py-1 rounded-lg font-medium'>
                                            {quiz.questions.length} Questions
                                        </span>
                                        <span className='bg-white/15 text-xs px-2.5 py-1 rounded-lg font-medium'>
                                            {totalPoints} pts
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className='text-white/60 hover:text-white hover:bg-white/10 rounded-xl p-2 transition-all'
                                >
                                    <X size={18} />
                                </button>
                            </div>
                        </div>

                        <div className='flex-1 overflow-y-auto p-5 space-y-3'>
                            {quiz.questions.map((q, i) => (
                                <div
                                    key={q.id || i}
                                    className='border border-[#e8edf5] dark:border-[#1f2740] rounded-2xl overflow-hidden'
                                >
                                    <div className='px-4 py-3 bg-gray-50 dark:bg-[#1a1f2e] border-b border-[#e8edf5] dark:border-[#1f2740] flex items-center gap-2'>
                                        <span className='w-6 h-6 flex items-center justify-center rounded-lg bg-indigo-600 text-white text-xs font-bold'>
                                            {i + 1}
                                        </span>
                                        <span className='text-sm font-semibold text-gray-800 dark:text-white flex-1'>
                                            {q.text || 'No question text'}
                                        </span>
                                        <span className='text-xs text-indigo-500 font-bold'>
                                            {q.points || 1}pt
                                        </span>
                                    </div>
                                    <div className='p-4 grid grid-cols-1 sm:grid-cols-2 gap-2'>
                                        {q.options?.map((opt, oi) => (
                                            <div
                                                key={oi}
                                                className={`flex items-center gap-2.5 p-2.5 rounded-xl text-sm border-2 ${
                                                    oi === q.correctAnswer
                                                        ? 'bg-emerald-50 border-emerald-300 text-emerald-800 dark:bg-emerald-950/20 dark:border-emerald-700 dark:text-emerald-300 font-semibold'
                                                        : 'bg-gray-50 dark:bg-[#1a1f2e] border-transparent text-gray-600 dark:text-gray-400'
                                                }`}
                                            >
                                                <span className='w-5 h-5 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-bold bg-white dark:bg-[#0d1117] border border-current'>
                                                    {String.fromCharCode(
                                                        65 + oi,
                                                    )}
                                                </span>
                                                {opt}
                                                {oi === q.correctAnswer && (
                                                    <Check
                                                        size={12}
                                                        className='ml-auto flex-shrink-0'
                                                    />
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    {q.explanation && (
                                        <div className='mx-4 mb-4 p-3 bg-indigo-50 dark:bg-indigo-950/20 border-l-4 border-indigo-400 rounded-xl text-xs text-indigo-700 dark:text-indigo-300'>
                                            <strong>Explanation:</strong>{' '}
                                            {q.explanation}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className='border-t border-[#e8edf5] dark:border-[#1f2740] p-4 flex justify-end'>
                            <button
                                onClick={() => setShowPreview(false)}
                                className='px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all'
                            >
                                Close Preview
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CreateQuiz;
