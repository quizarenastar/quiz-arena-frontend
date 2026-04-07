import { useState } from 'react';
import { X, Swords, Globe, Lock, Users, Zap } from 'lucide-react';

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

export default function CreateWarRoomModal({ onClose, onSubmit, loading }) {
    const [form, setForm] = useState({
        name: '',
        visibility: 'public',
        maxPlayers: 10,
        topic: '',
        difficulty: 'medium',
        totalQuestions: 10,
        timePerQuestion: 30,
        category: 'general-knowledge',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name: form.name,
            visibility: form.visibility,
            maxPlayers: form.maxPlayers,
            settings: {
                topic: form.topic || 'General Knowledge',
                difficulty: form.difficulty,
                totalQuestions: form.totalQuestions,
                timePerQuestion: form.timePerQuestion,
                category: form.category,
            },
        });
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
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer'
                    style={{ color: '#94a3b8' }}
                    onMouseEnter={(e) => (e.target.style.color = '#f87171')}
                    onMouseLeave={(e) => (e.target.style.color = '#94a3b8')}
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div
                        className='p-2.5 rounded-xl'
                        style={{
                            background: 'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            boxShadow: '0 4px 15px rgba(139, 92, 246, 0.4)',
                        }}
                    >
                        <Swords size={24} color='#fff' />
                    </div>
                    <div>
                        <h2
                            className='text-xl font-bold'
                            style={{ color: '#f1f5f9' }}
                        >
                            Create War Room
                        </h2>
                        <p
                            className='text-sm'
                            style={{ color: '#94a3b8' }}
                        >
                            Set up your arena and invite friends
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Room Name */}
                    <div>
                        <label
                            className='block text-sm font-medium mb-1.5'
                            style={{ color: '#cbd5e1' }}
                        >
                            Room Name *
                        </label>
                        <input
                            type='text'
                            required
                            minLength={2}
                            maxLength={50}
                            value={form.name}
                            onChange={(e) =>
                                setForm({ ...form, name: e.target.value })
                            }
                            placeholder='e.g., Battle of Brains'
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={{
                                background: 'rgba(30, 30, 50, 0.8)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                color: '#f1f5f9',
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(139, 92, 246, 0.6)')
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(139, 92, 246, 0.2)')
                            }
                        />
                    </div>

                    {/* Visibility */}
                    <div>
                        <label
                            className='block text-sm font-medium mb-1.5'
                            style={{ color: '#cbd5e1' }}
                        >
                            Visibility
                        </label>
                        <div className='flex gap-3'>
                            {['public', 'private'].map((v) => (
                                <button
                                    key={v}
                                    type='button'
                                    onClick={() =>
                                        setForm({ ...form, visibility: v })
                                    }
                                    className='flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 transition-all cursor-pointer'
                                    style={{
                                        background:
                                            form.visibility === v
                                                ? 'linear-gradient(135deg, #8b5cf6, #6d28d9)'
                                                : 'rgba(30, 30, 50, 0.8)',
                                        border: `1px solid ${form.visibility === v ? 'rgba(139,92,246,0.6)' : 'rgba(139,92,246,0.15)'}`,
                                        color:
                                            form.visibility === v
                                                ? '#fff'
                                                : '#94a3b8',
                                    }}
                                >
                                    {v === 'public' ? (
                                        <Globe size={16} />
                                    ) : (
                                        <Lock size={16} />
                                    )}
                                    {v.charAt(0).toUpperCase() + v.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Max Players */}
                    <div>
                        <label
                            className='block text-sm font-medium mb-1.5'
                            style={{ color: '#cbd5e1' }}
                        >
                            <Users
                                size={14}
                                className='inline mr-1'
                            />
                            Max Players: {form.maxPlayers}
                        </label>
                        <input
                            type='range'
                            min={2}
                            max={10}
                            value={form.maxPlayers}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    maxPlayers: parseInt(e.target.value),
                                })
                            }
                            className='w-full accent-purple-500'
                        />
                        <div
                            className='flex justify-between text-xs mt-1'
                            style={{ color: '#64748b' }}
                        >
                            <span>2</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Topic */}
                    <div>
                        <label
                            className='block text-sm font-medium mb-1.5'
                            style={{ color: '#cbd5e1' }}
                        >
                            Quiz Topic
                        </label>
                        <input
                            type='text'
                            value={form.topic}
                            onChange={(e) =>
                                setForm({ ...form, topic: e.target.value })
                            }
                            placeholder='e.g., JavaScript, World History...'
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all'
                            style={{
                                background: 'rgba(30, 30, 50, 0.8)',
                                border: '1px solid rgba(139, 92, 246, 0.2)',
                                color: '#f1f5f9',
                            }}
                            onFocus={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(139, 92, 246, 0.6)')
                            }
                            onBlur={(e) =>
                                (e.target.style.borderColor =
                                    'rgba(139, 92, 246, 0.2)')
                            }
                        />
                    </div>

                    {/* Category & Difficulty row */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label
                                className='block text-sm font-medium mb-1.5'
                                style={{ color: '#cbd5e1' }}
                            >
                                Category
                            </label>
                            <select
                                value={form.category}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        category: e.target.value,
                                    })
                                }
                                className='w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer'
                                style={{
                                    background: 'rgba(30, 30, 50, 0.8)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    color: '#f1f5f9',
                                }}
                            >
                                {CATEGORIES.map((c) => (
                                    <option key={c} value={c}>
                                        {c
                                            .split('-')
                                            .map(
                                                (w) =>
                                                    w.charAt(0).toUpperCase() +
                                                    w.slice(1)
                                            )
                                            .join(' ')}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label
                                className='block text-sm font-medium mb-1.5'
                                style={{ color: '#cbd5e1' }}
                            >
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
                                className='w-full px-3 py-2.5 rounded-xl text-sm outline-none cursor-pointer'
                                style={{
                                    background: 'rgba(30, 30, 50, 0.8)',
                                    border: '1px solid rgba(139, 92, 246, 0.2)',
                                    color: '#f1f5f9',
                                }}
                            >
                                <option value='easy'>Easy</option>
                                <option value='medium'>Medium</option>
                                <option value='hard'>Hard</option>
                            </select>
                        </div>
                    </div>

                    {/* Questions & Time row */}
                    <div className='grid grid-cols-2 gap-3'>
                        <div>
                            <label
                                className='block text-sm font-medium mb-1.5'
                                style={{ color: '#cbd5e1' }}
                            >
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
                                        totalQuestions: parseInt(e.target.value),
                                    })
                                }
                                className='w-full accent-purple-500'
                            />
                        </div>
                        <div>
                            <label
                                className='block text-sm font-medium mb-1.5'
                                style={{ color: '#cbd5e1' }}
                            >
                                <Zap size={14} className='inline mr-1' />
                                {form.timePerQuestion}s / question
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
                                            e.target.value
                                        ),
                                    })
                                }
                                className='w-full accent-purple-500'
                            />
                        </div>
                    </div>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading || !form.name.trim()}
                        className='w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed'
                        style={{
                            background:
                                'linear-gradient(135deg, #8b5cf6, #6d28d9)',
                            boxShadow:
                                '0 4px 15px rgba(139, 92, 246, 0.4)',
                        }}
                        onMouseEnter={(e) =>
                            !loading &&
                            (e.target.style.boxShadow =
                                '0 6px 25px rgba(139, 92, 246, 0.6)')
                        }
                        onMouseLeave={(e) =>
                            (e.target.style.boxShadow =
                                '0 4px 15px rgba(139, 92, 246, 0.4)')
                        }
                    >
                        {loading ? (
                            <span className='flex items-center justify-center gap-2'>
                                <span className='animate-spin'>⚡</span>
                                Creating...
                            </span>
                        ) : (
                            <span className='flex items-center justify-center gap-2'>
                                <Swords size={18} />
                                Create War Room
                            </span>
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
