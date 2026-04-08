import { useEffect, useState } from 'react';
import { X, Play, Zap, Clock, BookOpen, BarChart3, Sparkles } from 'lucide-react';
import WarRoomService from '../../service/WarRoomService';
import toast from 'react-hot-toast';

export default function StartQuizModal({
    onClose,
    onStart,
    loading,
    roomId,
    roomName,
    roomDescription,
}) {
    const [form, setForm] = useState({
        topic: '',
        difficulty: 'medium',
        totalQuestions: 10,
        timePerQuestion: 30,
    });
    const [suggestionsLoading, setSuggestionsLoading] = useState(false);
    const [suggestedTopics, setSuggestedTopics] = useState([]);

    useEffect(() => {
        const loadSuggestions = async () => {
            if (!roomId) return;
            try {
                setSuggestionsLoading(true);
                const res = await WarRoomService.getSuggestedQuestions(roomId);
                const topics = res.data?.topics || [];
                setSuggestedTopics(topics);
                setForm((prev) => ({
                    ...prev,
                    topic: topics[0] || res.data?.topicSuggestion || roomName || '',
                }));
            } catch (error) {
                toast.error(
                    error.message || 'Failed to load AI topic suggestions'
                );
            } finally {
                setSuggestionsLoading(false);
            }
        };
        loadSuggestions();
    }, [roomId, roomName]);

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart({
            topic: form.topic.trim(),
            difficulty: form.difficulty,
            totalQuestions: form.totalQuestions,
            timePerQuestion: form.timePerQuestion,
        });
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <div className='relative w-full max-w-lg mx-4 rounded-2xl p-6 overflow-y-auto max-h-[90vh] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl'>
                {/* Close */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500'
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 shadow-sm'>
                        <Play size={24} color='#fff' />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                            Configure Quiz Round
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Set topic, difficulty, and time before starting.
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Room Context */}
                    {(roomName || roomDescription) && (
                        <div className='px-4 py-3 rounded-xl border border-indigo-200 dark:border-indigo-700/40 bg-indigo-50 dark:bg-indigo-900/20'>
                            <p className='text-xs font-medium text-indigo-700 dark:text-indigo-300'>
                                Room Context
                            </p>
                            <p className='text-sm mt-1 text-gray-700 dark:text-gray-200'>
                                {roomName}
                            </p>
                            {roomDescription && (
                                <p className='text-xs mt-1 text-gray-600 dark:text-gray-400'>
                                    {roomDescription}
                                </p>
                            )}
                        </div>
                    )}

                    {/* Topic */}
                    <div>
                        <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                            <BookOpen size={14} />
                            Quiz Topic
                        </label>
                        <input
                            type='text'
                            value={form.topic}
                            onChange={(e) =>
                                setForm({ ...form, topic: e.target.value })
                            }
                            placeholder='e.g., JavaScript, World History, Space...'
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                        />
                        <p className='text-xs mt-1 text-gray-500 dark:text-gray-400'>
                            AI suggests a topic first; you can edit or replace it.
                        </p>
                    </div>

                    {/* Difficulty */}
                    <div>
                        <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                            <BarChart3 size={14} />
                            Difficulty
                        </label>
                        <select
                            value={form.difficulty}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    difficulty: e.target.value,
                                })
                            }
                            className='w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                        >
                            <option value='easy'>🟢 Easy</option>
                            <option value='medium'>🟡 Medium</option>
                            <option value='hard'>🔴 Hard</option>
                        </select>
                    </div>

                    {/* AI Suggested Topics */}
                    <div className='rounded-xl border border-violet-200 dark:border-violet-700/40 bg-violet-50 dark:bg-violet-900/20 p-4'>
                        <div className='flex items-center gap-2 mb-2'>
                            <Sparkles size={14} className='text-violet-500' />
                            <p className='text-sm font-semibold text-violet-700 dark:text-violet-300'>
                                AI Suggested Topics
                            </p>
                        </div>
                        {suggestionsLoading ? (
                            <p className='text-xs text-gray-600 dark:text-gray-400'>
                                Generating topic suggestions from room name and description...
                            </p>
                        ) : suggestedTopics.length === 0 ? (
                            <p className='text-xs text-gray-600 dark:text-gray-400'>
                                No suggestions yet. Enter your own topic above.
                            </p>
                        ) : (
                            <div className='flex flex-wrap gap-2'>
                                {suggestedTopics.map((topic) => (
                                    <button
                                        key={topic}
                                        type='button'
                                        onClick={() =>
                                            setForm((prev) => ({
                                                ...prev,
                                                topic,
                                            }))
                                        }
                                        className='px-2.5 py-1 rounded-lg text-xs border border-violet-300 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 hover:bg-violet-100 dark:hover:bg-violet-900/40'
                                    >
                                        {topic}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Questions & Time */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                                <BookOpen size={14} />
                                Questions: {form.totalQuestions}
                            </label>
                            <input
                                type='range'
                                min={5}
                                max={30}
                                step={5}
                                value={form.totalQuestions}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        totalQuestions: parseInt(
                                            e.target.value,
                                        ),
                                    })
                                }
                                className='w-full accent-purple-500'
                            />
                            <div className='flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400'>
                                <span>5</span>
                                <span>30</span>
                            </div>
                        </div>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                                <Clock size={14} />
                                Time: {form.timePerQuestion}s / question
                            </label>
                            <input
                                type='range'
                                min={10}
                                max={120}
                                step={5}
                                value={form.timePerQuestion}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        timePerQuestion: parseInt(
                                            e.target.value,
                                        ),
                                    })
                                }
                                className='w-full accent-purple-500'
                            />
                            <div className='flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400'>
                                <span>10s</span>
                                <span>120s</span>
                            </div>
                        </div>
                    </div>

                    {/* Duration preview */}
                    <div className='flex items-center justify-between px-4 py-3 rounded-xl bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/40'>
                        <span className='text-sm text-violet-700 dark:text-violet-300'>
                            <Zap size={14} className='inline mr-1' />
                            Estimated Duration
                        </span>
                        <span className='text-sm font-semibold text-gray-800 dark:text-gray-200'>
                            {Math.ceil(
                                (form.totalQuestions * form.timePerQuestion) /
                                    60,
                            )}{' '}
                            min
                        </span>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 shadow-sm'
                    >
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <span className='animate-spin'>⚡</span>
                                Starting...
                            </span>
                        ) : (
                            <span className='flex items-center justify-center gap-2'>
                                <Play size={18} />
                                Start Quiz Round
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
