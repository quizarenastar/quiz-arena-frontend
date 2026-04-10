import { useState } from 'react';
import { X, Swords, Globe, Lock, Users } from 'lucide-react';

export default function CreateWarRoomModal({ onClose, onSubmit, loading }) {
    const [form, setForm] = useState({
        name: '',
        description: '',
        visibility: 'public',
        maxPlayers: 10,
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit({
            name: form.name,
            description: form.description,
            visibility: form.visibility,
            maxPlayers: form.maxPlayers,
        });
    };

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm'>
            <div className='relative w-full max-w-md mx-4 rounded-2xl p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-2xl'>
                {/* Close button */}
                <button
                    onClick={onClose}
                    className='absolute top-4 right-4 p-1.5 rounded-lg transition-colors cursor-pointer text-gray-500 dark:text-gray-400 hover:text-red-500'
                >
                    <X size={20} />
                </button>

                {/* Header */}
                <div className='flex items-center gap-3 mb-6'>
                    <div className='p-2.5 rounded-xl bg-gradient-to-r from-violet-500 to-purple-600 shadow-sm'>
                        <Swords size={24} color='#fff' />
                    </div>
                    <div>
                        <h2 className='text-xl font-bold text-gray-900 dark:text-white'>
                            Create War Room
                        </h2>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Set up your arena and invite friends
                        </p>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='space-y-5'>
                    {/* Room Name */}
                    <div>
                        <label className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
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
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent'
                        />
                    </div>

                    {/* Room Description */}
                    <div>
                        <label className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                            What is this room about?
                        </label>
                        <textarea
                            value={form.description}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    description: e.target.value.slice(0, 300),
                                })
                            }
                            rows={3}
                            placeholder='e.g., JavaScript interview prep, cricket trivia, world capitals...'
                            className='w-full px-4 py-2.5 rounded-xl text-sm outline-none transition-all border border-violet-200 dark:border-violet-700/40 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-violet-500 focus:border-transparent resize-none'
                        />
                        <p className='text-xs mt-1 text-gray-500 dark:text-gray-400'>
                            This helps AI suggest better questions for each
                            round.
                        </p>
                    </div>

                    {/* Visibility */}
                    <div>
                        <label className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
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
                                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium flex-1 transition-all cursor-pointer border ${
                                        form.visibility === v
                                            ? 'bg-gradient-to-r from-violet-500 to-purple-600 border-violet-500 text-white'
                                            : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300'
                                    }`}
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
                        <label className='block text-sm font-medium mb-1.5 text-gray-700 dark:text-gray-300'>
                            <Users size={14} className='inline mr-1' />
                            Max Players: {form.maxPlayers}
                        </label>
                        <input
                            type='range'
                            min={1}
                            max={25}
                            value={form.maxPlayers}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    maxPlayers: parseInt(e.target.value),
                                })
                            }
                            className='w-full accent-purple-500'
                        />
                        <div className='flex justify-between text-xs mt-1 text-gray-500 dark:text-gray-400'>
                            <span>1 (Solo)</span>
                            <span>10</span>
                        </div>
                    </div>

                    {/* Info note */}
                    <p className='text-xs text-gray-500 dark:text-gray-400'>
                        💡 Quiz topic, difficulty, and time settings can be
                        configured when starting each round.
                    </p>

                    {/* Submit */}
                    <button
                        type='submit'
                        disabled={loading || !form.name.trim()}
                        className='w-full py-3 rounded-xl font-semibold text-white transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed bg-gradient-to-r from-violet-500 to-purple-600 hover:from-violet-600 hover:to-purple-700 shadow-sm'
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
