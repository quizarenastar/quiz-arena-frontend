import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    Plus,
    Trash2,
    Wand2,
    Save,
    Eye,
    DollarSign,
    ChevronDown,
    ChevronUp,
    Calendar,
    X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import QuizService from '../service/QuizService';

const CreateQuiz = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const editQuizId = searchParams.get('edit');
    const [loading, setLoading] = useState(false);
    const [aiGenerating, setAiGenerating] = useState(false);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [showPreview, setShowPreview] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const [quiz, setQuiz] = useState({
        title: '',
        description: '',
        topic: '',
        category: '',
        difficultyLevel: 'easy',
        isPaid: false,
        price: 0,
        timeLimit: 30,
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
        questionType: 'mcq',
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

    // Load quiz data if in edit mode
    useEffect(() => {
        const loadQuizForEdit = async (quizId) => {
            try {
                setLoading(true);
                console.log('Loading quiz for edit:', quizId);
                const response = await QuizService.getQuiz(quizId);
                console.log('Quiz data received:', response.data);
                const quizData = response.data.quiz;

                // Questions are returned separately in response.data.questions
                const questions =
                    response.data.questions || quizData.questions || [];
                console.log('Questions from backend:', questions);

                // Transform backend data to form state
                const transformedQuestions = questions.map((q, index) => {
                    console.log(`Transforming question ${index}:`, q);
                    return {
                        id: Date.now() + index,
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
                    };
                });

                console.log('Transformed questions:', transformedQuestions);

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
                    timeLimit: quizData.timeLimit || quizData.duration || 30,
                    startTime: quizData.startTime
                        ? new Date(quizData.startTime)
                              .toISOString()
                              .slice(0, 16)
                        : '',
                    endTime: quizData.endTime
                        ? new Date(quizData.endTime).toISOString().slice(0, 16)
                        : '',
                    settings: quizData.settings || {
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
                    questions: transformedQuestions,
                });

                setIsEditMode(true);
                toast.success(
                    `Quiz loaded: ${transformedQuestions.length} questions`
                );
            } catch (error) {
                toast.error(error.message || 'Failed to load quiz');
                console.error('Load Quiz Error:', error);
                navigate('/my-quizzes');
            } finally {
                setLoading(false);
            }
        };

        if (editQuizId) {
            loadQuizForEdit(editQuizId);
        }
    }, [editQuizId, navigate]);

    const handleQuizChange = (field, value) => {
        setQuiz((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleSettingsChange = (field, value) => {
        setQuiz((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                [field]: value,
            },
        }));
    };

    const handleAntiCheatChange = (field, value) => {
        setQuiz((prev) => ({
            ...prev,
            settings: {
                ...prev.settings,
                antiCheat: {
                    ...prev.settings.antiCheat,
                    [field]: value,
                },
            },
        }));
    };

    const addQuestion = () => {
        const newQuestion = {
            id: Date.now(),
            text: '',
            type: 'multiple-choice',
            options: ['', '', '', ''],
            correctAnswer: 0,
            explanation: '',
            points: 1,
        };
        setQuiz((prev) => ({
            ...prev,
            questions: [...prev.questions, newQuestion],
        }));
    };

    const updateQuestion = (index, field, value) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === index ? { ...q, [field]: value } : q
            ),
        }));
    };

    const updateQuestionOption = (questionIndex, optionIndex, value) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.map((q, i) =>
                i === questionIndex
                    ? {
                          ...q,
                          options: q.options.map((opt, j) =>
                              j === optionIndex ? value : opt
                          ),
                      }
                    : q
            ),
        }));
    };

    const deleteQuestion = (index) => {
        setQuiz((prev) => ({
            ...prev,
            questions: prev.questions.filter((_, i) => i !== index),
        }));
    };

    const generateQuestionsWithAI = async () => {
        if (!aiGeneration.topic.trim()) {
            toast.error('Please enter a topic for AI generation');
            return;
        }

        setAiGenerating(true);
        try {
            // Generate questions without creating quiz (preview mode)
            const result = await QuizService.generateQuestionsPreview({
                topic: aiGeneration.topic,
                numQuestions: aiGeneration.numberOfQuestions,
                difficulty: aiGeneration.difficultyLevel,
            });

            // Format questions for the form
            const formattedQuestions = (result.data.questions || []).map(
                (q, index) => ({
                    id: Date.now() + index,
                    text: q.question,
                    type: 'multiple-choice',
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    points: 1,
                })
            );

            // Update form with generated data
            setQuiz((prev) => ({
                ...prev,
                title:
                    result.data.suggestedTitle ||
                    prev.title ||
                    `${aiGeneration.topic} Quiz`,
                description:
                    result.data.suggestedDescription ||
                    prev.description ||
                    `A quiz about ${aiGeneration.topic}`,
                topic: aiGeneration.topic,
                category:
                    result.data.suggestedCategory ||
                    prev.category ||
                    'general-knowledge',
                difficultyLevel: aiGeneration.difficultyLevel,
                questions: formattedQuestions,
            }));

            toast.success(
                `✨ Generated ${formattedQuestions.length} questions! Title, description, and category have been auto-filled. You can edit them before saving.`
            );
        } catch (error) {
            toast.error(error.message || 'Failed to generate questions');
            console.error('AI Generation Error:', error);
        } finally {
            setAiGenerating(false);
        }
    };

    const saveQuiz = async () => {
        if (!quiz.title.trim()) {
            toast.error('Please enter a quiz title');
            return;
        }

        // if (!quiz.topic || !quiz.topic.trim()) {
        //     toast.error('Please enter a quiz topic');
        //     return;
        // }

        if (quiz.questions.length === 0) {
            toast.error('Please add at least one question');
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
                startTime: quiz.startTime || '',
                endTime: quiz.endTime || '',
                settings: quiz.settings,
                questions: quiz.questions.map((q) => ({
                    question: q.text,
                    options: q.options,
                    correctAnswer: q.correctAnswer,
                    explanation: q.explanation || '',
                    type: q.type || 'multiple-choice',
                    points: q.points || 1,
                })),
            };

            if (quiz._id) {
                await QuizService.updateQuiz(quiz._id, quizData);
                toast.success('Quiz updated successfully!');
            } else {
                const result = await QuizService.createQuiz(quizData);
                setQuiz((prev) => ({ ...prev, _id: result.data.quiz._id }));
                toast.success('Quiz created and submitted for approval!');
                //  redirect to my quizzes page
                navigate('/my-quizzes');
            }
        } catch (error) {
            toast.error(error.message || 'Failed to save quiz');
            console.error('Save Quiz Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const previewQuiz = () => {
        if (quiz.questions.length === 0) {
            toast.error('Add some questions to preview the quiz');
            return;
        }
        setShowPreview(true);
    };

    // Show loading state while fetching quiz for edit
    if (loading && editQuizId) {
        return (
            <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
                <div className='text-center'>
                    <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-yellow-500 mx-auto'></div>
                    <p className='mt-4 text-gray-600 dark:text-gray-400'>
                        Loading quiz for editing...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-gray-50 dark:bg-gray-900 py-8'>
            <div className='max-w-4xl mx-auto px-4'>
                {/* Header */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                    <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-4'>
                        {isEditMode ? 'Edit Quiz' : 'Create New Quiz'}
                    </h1>

                    {/* AI Question Generation */}
                    <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center'>
                            <Wand2 className='mr-2' size={20} />
                            AI Question Generation
                        </h2>

                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4'>
                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Topic
                                </label>
                                <input
                                    type='text'
                                    value={aiGeneration.topic}
                                    onChange={(e) =>
                                        setAiGeneration((prev) => ({
                                            ...prev,
                                            topic: e.target.value,
                                        }))
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    placeholder='e.g., JavaScript Basics'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Number of Questions
                                </label>
                                <input
                                    type='number'
                                    value={aiGeneration.numberOfQuestions}
                                    onChange={(e) =>
                                        setAiGeneration((prev) => ({
                                            ...prev,
                                            numberOfQuestions: parseInt(
                                                e.target.value
                                            ),
                                        }))
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    min='1'
                                    max='20'
                                />
                            </div>

                            <div>
                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                    Difficulty
                                </label>
                                <select
                                    value={aiGeneration.difficultyLevel}
                                    onChange={(e) =>
                                        setAiGeneration((prev) => ({
                                            ...prev,
                                            difficultyLevel: e.target.value,
                                        }))
                                    }
                                    className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                >
                                    {difficulties.map((diff) => (
                                        <option
                                            key={diff.value}
                                            value={diff.value}
                                        >
                                            {diff.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className='flex items-end'>
                                <button
                                    onClick={generateQuestionsWithAI}
                                    disabled={
                                        aiGenerating ||
                                        !aiGeneration.topic.trim()
                                    }
                                    className='w-full px-4 py-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white rounded-md font-medium transition-colors'
                                >
                                    {aiGenerating
                                        ? 'Generating...'
                                        : 'Generate'}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Quiz Basic Information */}
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Quiz Title *
                            </label>
                            <input
                                type='text'
                                value={quiz.title}
                                onChange={(e) =>
                                    handleQuizChange('title', e.target.value)
                                }
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                placeholder='Enter quiz title'
                            />
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Category
                            </label>
                            <select
                                value={quiz.category}
                                onChange={(e) =>
                                    handleQuizChange('category', e.target.value)
                                }
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            >
                                <option value=''>Select category</option>
                                {categories.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Difficulty
                            </label>
                            <select
                                value={quiz.difficultyLevel}
                                onChange={(e) =>
                                    handleQuizChange(
                                        'difficultyLevel',
                                        e.target.value
                                    )
                                }
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            >
                                {difficulties.map((diff) => (
                                    <option key={diff.value} value={diff.value}>
                                        {diff.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                Time Limit (minutes)
                            </label>
                            <input
                                type='number'
                                value={quiz.timeLimit}
                                onChange={(e) =>
                                    handleQuizChange(
                                        'timeLimit',
                                        parseInt(e.target.value)
                                    )
                                }
                                className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                min='1'
                            />
                        </div>
                    </div>

                    <div className='mt-4'>
                        <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                            Description
                        </label>
                        <textarea
                            value={quiz.description}
                            onChange={(e) =>
                                handleQuizChange('description', e.target.value)
                            }
                            rows={3}
                            className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                            placeholder='Enter quiz description'
                        />
                    </div>

                    {/* Pricing */}
                    <div className='mt-6 border-t pt-6'>
                        <div className='flex items-center space-x-4'>
                            <label className='flex items-center'>
                                <input
                                    type='checkbox'
                                    checked={quiz.isPaid}
                                    onChange={(e) =>
                                        handleQuizChange(
                                            'isPaid',
                                            e.target.checked
                                        )
                                    }
                                    className='mr-2'
                                />
                                <DollarSign size={16} className='mr-1' />
                                Paid Quiz
                            </label>

                            {quiz.isPaid && (
                                <div>
                                    <input
                                        type='number'
                                        value={quiz.price}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'price',
                                                parseFloat(e.target.value)
                                            )
                                        }
                                        className='px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md w-24 dark:bg-gray-700 dark:text-white'
                                        placeholder='Price'
                                        min='0'
                                        step='0.01'
                                    />
                                    <span className='ml-2 text-sm text-gray-600 dark:text-gray-400'>
                                        INR
                                    </span>
                                </div>
                            )}
                        </div>

                        {/* Timing for Paid Quizzes */}
                        {quiz.isPaid && (
                            <div className='mt-4 grid grid-cols-1 md:grid-cols-2 gap-4'>
                                <div>
                                    <label className='flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        <Calendar size={16} className='mr-2' />
                                        Start Time (Optional)
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={quiz.startTime}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'startTime',
                                                e.target.value
                                            )
                                        }
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    />
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                        When quiz becomes available
                                    </p>
                                </div>

                                <div>
                                    <label className='flex items-center text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        <Calendar size={16} className='mr-2' />
                                        End Time (Optional)
                                    </label>
                                    <input
                                        type='datetime-local'
                                        value={quiz.endTime}
                                        onChange={(e) =>
                                            handleQuizChange(
                                                'endTime',
                                                e.target.value
                                            )
                                        }
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                    />
                                    <p className='text-xs text-gray-500 dark:text-gray-400 mt-1'>
                                        When quiz closes
                                    </p>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Advanced Settings */}
                    <div className='mt-6 border-t pt-6'>
                        <button
                            type='button'
                            onClick={() =>
                                setShowAdvancedSettings(!showAdvancedSettings)
                            }
                            className='flex items-center justify-between w-full text-left font-medium text-gray-900 dark:text-white mb-4'
                        >
                            <span>Advanced Settings</span>
                            {showAdvancedSettings ? (
                                <ChevronUp size={20} />
                            ) : (
                                <ChevronDown size={20} />
                            )}
                        </button>

                        {showAdvancedSettings && (
                            <div className='space-y-4 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg'>
                                {/* Quiz Settings */}
                                <div>
                                    <h3 className='font-medium text-gray-900 dark:text-white mb-3'>
                                        Quiz Settings
                                    </h3>
                                    <div className='space-y-2'>
                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    quiz.settings
                                                        .shuffleQuestions
                                                }
                                                onChange={(e) =>
                                                    handleSettingsChange(
                                                        'shuffleQuestions',
                                                        e.target.checked
                                                    )
                                                }
                                                className='mr-2'
                                            />
                                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                Shuffle Questions
                                            </span>
                                        </label>

                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    quiz.settings.shuffleOptions
                                                }
                                                onChange={(e) =>
                                                    handleSettingsChange(
                                                        'shuffleOptions',
                                                        e.target.checked
                                                    )
                                                }
                                                className='mr-2'
                                            />
                                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                Shuffle Answer Options
                                            </span>
                                        </label>

                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    quiz.settings
                                                        .showCorrectAnswers
                                                }
                                                onChange={(e) =>
                                                    handleSettingsChange(
                                                        'showCorrectAnswers',
                                                        e.target.checked
                                                    )
                                                }
                                                className='mr-2'
                                            />
                                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                Show Correct Answers After
                                                Completion
                                            </span>
                                        </label>

                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    quiz.settings.allowReview
                                                }
                                                onChange={(e) =>
                                                    handleSettingsChange(
                                                        'allowReview',
                                                        e.target.checked
                                                    )
                                                }
                                                className='mr-2'
                                            />
                                            <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                Allow Review Before Submit
                                            </span>
                                        </label>
                                    </div>
                                </div>

                                {/* Anti-Cheat Settings */}
                                <div>
                                    <h3 className='font-medium text-gray-900 dark:text-white mb-3'>
                                        Anti-Cheat Settings
                                    </h3>
                                    <div className='space-y-2'>
                                        <label className='flex items-center'>
                                            <input
                                                type='checkbox'
                                                checked={
                                                    quiz.settings.antiCheat
                                                        .enabled
                                                }
                                                onChange={(e) =>
                                                    handleAntiCheatChange(
                                                        'enabled',
                                                        e.target.checked
                                                    )
                                                }
                                                className='mr-2'
                                            />
                                            <span className='text-sm font-medium text-gray-700 dark:text-gray-300'>
                                                Enable Anti-Cheat
                                            </span>
                                        </label>

                                        {quiz.settings.antiCheat.enabled && (
                                            <>
                                                <label className='flex items-center ml-6'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            quiz.settings
                                                                .antiCheat
                                                                .detectTabSwitch
                                                        }
                                                        onChange={(e) =>
                                                            handleAntiCheatChange(
                                                                'detectTabSwitch',
                                                                e.target.checked
                                                            )
                                                        }
                                                        className='mr-2'
                                                    />
                                                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                        Detect Tab Switching
                                                    </span>
                                                </label>

                                                <label className='flex items-center ml-6'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            quiz.settings
                                                                .antiCheat
                                                                .detectCopyPaste
                                                        }
                                                        onChange={(e) =>
                                                            handleAntiCheatChange(
                                                                'detectCopyPaste',
                                                                e.target.checked
                                                            )
                                                        }
                                                        className='mr-2'
                                                    />
                                                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                        Detect Copy/Paste
                                                    </span>
                                                </label>

                                                <label className='flex items-center ml-6'>
                                                    <input
                                                        type='checkbox'
                                                        checked={
                                                            quiz.settings
                                                                .antiCheat
                                                                .randomizeQuestions
                                                        }
                                                        onChange={(e) =>
                                                            handleAntiCheatChange(
                                                                'randomizeQuestions',
                                                                e.target.checked
                                                            )
                                                        }
                                                        className='mr-2'
                                                    />
                                                    <span className='text-sm text-gray-700 dark:text-gray-300'>
                                                        Randomize Question Order
                                                    </span>
                                                </label>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Questions Section */}
                <div className='bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 mb-6'>
                    <div className='flex justify-between items-center mb-4'>
                        <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                            Questions ({quiz.questions.length})
                        </h2>
                        <button
                            onClick={addQuestion}
                            className='px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md font-medium flex items-center'
                        >
                            <Plus size={16} className='mr-2' />
                            Add Question
                        </button>
                    </div>

                    {quiz.questions.map((question, questionIndex) => (
                        <div
                            key={question.id}
                            className='border border-gray-200 dark:border-gray-600 rounded-lg p-4 mb-4'
                        >
                            <div className='flex justify-between items-start mb-4'>
                                <h3 className='text-lg font-medium text-gray-900 dark:text-white'>
                                    Question {questionIndex + 1}
                                </h3>
                                <button
                                    onClick={() =>
                                        deleteQuestion(questionIndex)
                                    }
                                    className='text-red-600 hover:text-red-800'
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>

                            <div className='space-y-4'>
                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Question Text *
                                    </label>
                                    <textarea
                                        value={question.text}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                'text',
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                        placeholder='Enter your question'
                                    />
                                </div>

                                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                                    {question.options.map(
                                        (option, optionIndex) => (
                                            <div key={optionIndex}>
                                                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                                    Option {optionIndex + 1}
                                                    {question.correctAnswer ===
                                                        optionIndex && (
                                                        <span className='text-green-600 ml-1'>
                                                            (Correct)
                                                        </span>
                                                    )}
                                                </label>
                                                <div className='flex space-x-2'>
                                                    <input
                                                        type='radio'
                                                        name={`correct-${question.id}`}
                                                        checked={
                                                            question.correctAnswer ===
                                                            optionIndex
                                                        }
                                                        onChange={() =>
                                                            updateQuestion(
                                                                questionIndex,
                                                                'correctAnswer',
                                                                optionIndex
                                                            )
                                                        }
                                                        className='mt-2'
                                                    />
                                                    <input
                                                        type='text'
                                                        value={option}
                                                        onChange={(e) =>
                                                            updateQuestionOption(
                                                                questionIndex,
                                                                optionIndex,
                                                                e.target.value
                                                            )
                                                        }
                                                        className='flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                                        placeholder={`Option ${
                                                            optionIndex + 1
                                                        }`}
                                                    />
                                                </div>
                                            </div>
                                        )
                                    )}
                                </div>

                                <div>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Explanation (Optional)
                                    </label>
                                    <textarea
                                        value={question.explanation}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                'explanation',
                                                e.target.value
                                            )
                                        }
                                        rows={2}
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                        placeholder='Explain why this is the correct answer'
                                    />
                                </div>

                                <div className='w-24'>
                                    <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                                        Points
                                    </label>
                                    <input
                                        type='number'
                                        value={question.points}
                                        onChange={(e) =>
                                            updateQuestion(
                                                questionIndex,
                                                'points',
                                                parseInt(e.target.value)
                                            )
                                        }
                                        className='w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 dark:bg-gray-700 dark:text-white'
                                        min='1'
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {quiz.questions.length === 0 && (
                        <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
                            No questions added yet. Use the "Add Question"
                            button or generate questions with AI.
                        </div>
                    )}
                </div>

                {/* Action Buttons */}
                <div className='flex space-x-4'>
                    <button
                        onClick={saveQuiz}
                        disabled={loading}
                        className='px-6 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-400 text-white rounded-md font-medium flex items-center'
                    >
                        <Save size={16} className='mr-2' />
                        {loading
                            ? 'Saving...'
                            : isEditMode
                            ? 'Update Quiz'
                            : 'Save Quiz'}
                    </button>

                    <button
                        onClick={previewQuiz}
                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium flex items-center'
                    >
                        <Eye size={16} className='mr-2' />
                        Preview
                    </button>

                    <button
                        onClick={() => navigate('/my-quizzes')}
                        className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-md font-medium'
                    >
                        Cancel
                    </button>
                </div>
            </div>

            {/* Preview Modal */}
            {showPreview && (
                <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4'>
                    <div className='bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col'>
                        {/* Modal Header */}
                        <div className='bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6'>
                            <div className='flex justify-between items-start'>
                                <div>
                                    <h2 className='text-2xl font-bold mb-2'>
                                        {quiz.title || 'Untitled Quiz'}
                                    </h2>
                                    <p className='text-blue-100'>
                                        {quiz.description || 'No description'}
                                    </p>
                                    <div className='mt-3 flex gap-4 text-sm'>
                                        <span className='bg-white/20 px-3 py-1 rounded'>
                                            Category:{' '}
                                            {quiz.category || 'Not specified'}
                                        </span>
                                        <span className='bg-white/20 px-3 py-1 rounded'>
                                            Difficulty:{' '}
                                            {quiz.difficulty || 'Not specified'}
                                        </span>
                                        <span className='bg-white/20 px-3 py-1 rounded'>
                                            Questions: {quiz.questions.length}
                                        </span>
                                    </div>
                                </div>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    className='text-white hover:bg-white/20 rounded-full p-2 transition-colors'
                                >
                                    <X size={24} />
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Questions List */}
                        <div className='flex-1 overflow-y-auto p-6'>
                            {quiz.questions.length === 0 ? (
                                <div className='text-center py-12 text-gray-500'>
                                    <p className='text-lg'>
                                        No questions added yet
                                    </p>
                                    <p className='text-sm mt-2'>
                                        Add questions manually or generate them
                                        with AI
                                    </p>
                                </div>
                            ) : (
                                <div className='space-y-6'>
                                    {quiz.questions.map((question, index) => (
                                        <div
                                            key={question.id || index}
                                            className='border border-gray-200 rounded-lg p-5 bg-gray-50'
                                        >
                                            {/* Question Header */}
                                            <div className='flex items-start justify-between mb-4'>
                                                <h3 className='text-lg font-semibold text-gray-800 flex-1'>
                                                    <span className='text-blue-600 mr-2'>
                                                        Q{index + 1}.
                                                    </span>
                                                    {question.text ||
                                                        'No question text'}
                                                </h3>
                                                <span className='bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium whitespace-nowrap ml-3'>
                                                    {question.points || 1}{' '}
                                                    {question.points === 1
                                                        ? 'point'
                                                        : 'points'}
                                                </span>
                                            </div>

                                            {/* Options */}
                                            <div className='space-y-2 mb-3'>
                                                {question.options?.map(
                                                    (option, optIndex) => (
                                                        <div
                                                            key={optIndex}
                                                            className={`p-3 rounded-lg border ${
                                                                optIndex ===
                                                                question.correctAnswer
                                                                    ? 'bg-green-50 border-green-300 font-medium'
                                                                    : 'bg-white border-gray-200'
                                                            }`}
                                                        >
                                                            <div className='flex items-center'>
                                                                <span className='mr-3 text-gray-600 font-semibold'>
                                                                    {String.fromCharCode(
                                                                        65 +
                                                                            optIndex
                                                                    )}
                                                                    .
                                                                </span>
                                                                <span
                                                                    className={
                                                                        optIndex ===
                                                                        question.correctAnswer
                                                                            ? 'text-green-700'
                                                                            : 'text-gray-700'
                                                                    }
                                                                >
                                                                    {option}
                                                                </span>
                                                                {optIndex ===
                                                                    question.correctAnswer && (
                                                                    <span className='ml-auto text-green-600 text-sm font-semibold'>
                                                                        ✓
                                                                        Correct
                                                                    </span>
                                                                )}
                                                            </div>
                                                        </div>
                                                    )
                                                )}
                                            </div>

                                            {/* Explanation */}
                                            {question.explanation && (
                                                <div className='mt-3 p-3 bg-blue-50 border-l-4 border-blue-500 rounded'>
                                                    <p className='text-sm font-semibold text-blue-800 mb-1'>
                                                        Explanation:
                                                    </p>
                                                    <p className='text-sm text-blue-700'>
                                                        {question.explanation}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className='border-t border-gray-200 p-4 bg-gray-50 flex justify-end'>
                            <button
                                onClick={() => setShowPreview(false)}
                                className='px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors'
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
