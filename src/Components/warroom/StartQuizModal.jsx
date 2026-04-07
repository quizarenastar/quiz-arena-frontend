import { useState } from 'react';
import { X, Play, Zap, Clock, BookOpen, BarChart3, Layers } from 'lucide-react';

const CATEGORIES = [
    'general-knowledge',
    'programming',
    'technology',
    'mathematics',
    'science',
    'history',
    'geography',
    'sports',
    'entertainment',
    'literature',
    'business',
    'language',
];

export default function StartQuizModal({ onClose, onStart, loading }) {
    const [form, setForm] = useState({
        topic: '',
        category: 'general-knowledge',
        difficulty: 'medium',
        totalQuestions: 10,
        timePerQuestion: 30,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onStart({
            topic: form.topic || 'General Knowledge',
            category: form.category,
            difficulty: form.difficulty,
            totalQuestions: form.totalQuestions,
            timePerQuestion: form.timePerQuestion,
        });
    };

    const inputStyle = {
        background: 'rgba(15, 15, 30, 0.8)',
        border: '1px solid rgba(139, 92, 246, 0.2)',
        color: '#f1f5f9',
    };

    return (
        <div
            className='fixed inset-0 z-50 flex items-center justify-center'
            style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)' }}
        >
            <div
                className='relative w-full max-w-lg mx-4 rounded-2xl p-6 overflow-y-auto max-h-[90vh]'
                style={{
                    background: 'linear-gradient(145deg, #1e1e2e, #2a2a3e)',
                    border: '1px solid rgba(139, 92, 246, 0.3)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.05)',
                }}
            >
                {/* Close */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer'
                    style={{ color: '#94a3b8' }}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div
                        className='p-2.5 rounded-xl'
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                        }}
                    >
                        <Play size={24} color='#fff' />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold' style={{ color: '#f1f5f9' }}>
                            Configure Quiz Round
                        </h2>
                        <p className='text-sm' style={{ color: '#94a3b8' }}>
                            Set topic, difficulty, and time before starting
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Topic */}
                    <div>
                        <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5' style={{ color: '#cbd5e1' }}>
                            <BookOpen size={14} />
                            Quiz Topic
                        </label>
                        <input
                            type='text'
                            value={form.topic}
                            onChange={(e) => setForm({ ...form, topic: e.target.value })}
                            placeholder='e.g., JavaScript, World History, Space...'
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={inputStyle}
                            onFocus={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.6)')}
                            onBlur={(e) => (e.target.style.borderColor = 'rgba(139,92,246,0.2)')}
                        />
                        <p className='text-xs mt-1' style={{ color: '#64748b' }}>
                            Leave empty for General Knowledge
                        </p>
                    </div>

                    {/* Category & Difficulty */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5' style={{ color: '#cbd5e1' }}>
                                <Layers size={14} />
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) => setForm({ ...form, category: e.target.value })}
                                className='w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer'
                                style={inputStyle}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5' style={{ color: '#cbd5e1' }}>
                                <BarChart3 size={14} />
                                Difficulty
                            </label>
                            <select
                                value={form.difficulty}
                                onChange={(e) => setForm({ ...form, difficulty: e.target.value })}
                                className='w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer'
                                style={inputStyle}
                            >
                                <option value='easy'>🟢 Easy</option>
                                <option value='medium'>🟡 Medium</option>
                                <option value='hard'>🔴 Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Questions & Time */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5' style={{ color: '#cbd5e1' }}>
                                <BookOpen size={14} />
                                Questions: {form.totalQuestions}
                            </label>
                            <input
                                type='range'
                                min={5}
                                max={30}
                                step={5}
                                value={form.totalQuestions}
                                onChange={(e) => setForm({ ...form, totalQuestions: parseInt(e.target.value) })}
                                className='w-full accent-purple-500'
                            />
                            <div className='flex justify-between text-xs mt-1' style={{ color: '#64748b' }}>
                                <span>5</span>
                                <span>30</span>
                            </div>
                        </div>
                        <div>
                            <label className='flex items-center gap-1.5 text-sm font-medium mb-1.5' style={{ color: '#cbd5e1' }}>
                                <Clock size={14} />
                                Time: {form.timePerQuestion}s / question
                            </label>
                            <input
                                type='range'
                                min={10}
                                max={120}
                                step={5}
                                value={form.timePerQuestion}
                                onChange={(e) => setForm({ ...form, timePerQuestion: parseInt(e.target.value) })}
                                className='w-full accent-purple-500'
                            />
                            <div className='flex justify-between text-xs mt-1' style={{ color: '#64748b' }}>
                                <span>10s</span>
                                <span>120s</span>
                            </div>
                        </div>
                    </div>

                    {/* Duration preview */}
                    <div
                        className='flex items-center justify-between px-4 py-3 rounded-xl'
                        style={{ background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.15)' }}
                    >
                        <span className='text-sm' style={{ color: '#a78bfa' }}>
                            <Zap size={14} className='inline mr-1' />
                            Estimated Duration
                        </span>
                        <span className='text-sm font-semibold' style={{ color: '#e2e8f0' }}>
                            {Math.ceil((form.totalQuestions * form.timePerQuestion) / 60)} min
                        </span>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading}
                        className='w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            boxShadow: '0 4px 15px rgba(245, 158, 11, 0.4)',
                        }}
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
