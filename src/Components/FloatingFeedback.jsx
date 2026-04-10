import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';
import {
    MessageSquarePlus,
    X,
    Send,
    Bug,
    Lightbulb,
    MessageCircle,
    HelpCircle,
} from 'lucide-react';
import toast from 'react-hot-toast';
import ApiUrl from '../configs/apiUrls';

const CATEGORIES = [
    { value: 'bug', label: 'Bug Report', icon: Bug, color: 'text-red-500' },
    {
        value: 'feature',
        label: 'Feature Request',
        icon: Lightbulb,
        color: 'text-amber-500',
    },
    {
        value: 'feedback',
        label: 'Feedback',
        icon: MessageCircle,
        color: 'text-blue-500',
    },
    {
        value: 'other',
        label: 'Other',
        icon: HelpCircle,
        color: 'text-gray-500',
    },
];

export default function FloatingFeedback() {
    const user = useSelector((state) => state.auth.user);
    const location = useLocation();
    const [open, setOpen] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [form, setForm] = useState({
        category: 'feedback',
        name: '',
        email: '',
        subject: '',
        message: '',
        contactNumber: '',
    });

    const handleOpen = () => {
        setForm((prev) => ({
            ...prev,
            name: user?.name || user?.username || prev.name,
            email: user?.email || prev.email,
        }));
        setOpen(true);
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (
            !form.name ||
            !form.email ||
            !form.subject ||
            form.message.length < 10
        ) {
            toast.error(
                'Please fill all required fields (message min 10 chars)',
            );
            return;
        }
        setSubmitting(true);
        try {
            const res = await fetch(ApiUrl.CONTACT.SUBMIT, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...form,
                    pageUrl: window.location.href,
                }),
            });
            const data = await res.json();
            if (data.success) {
                toast.success('Feedback sent! Thank you.');
                setForm({
                    category: 'feedback',
                    name: '',
                    email: '',
                    subject: '',
                    message: '',
                    contactNumber: '',
                });
                setOpen(false);
            } else {
                toast.error(data.message || 'Failed to send');
            }
        } catch {
            toast.error('Something went wrong');
        } finally {
            setSubmitting(false);
        }
    };

    // Don't show on the contact-us page itself
    if (location.pathname === '/contact-us') return null;

    return (
        <>
            {/* Floating Button */}
            {!open && (
                <button
                    onClick={handleOpen}
                    className='fixed bottom-6 right-6 z-50 w-8 h-8 sm:w-12 sm:h-12 rounded-full bg-gradient-to-r from-violet-600 to-blue-600 text-white shadow-lg shadow-violet-500/30 hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center'
                    title='Report Bug / Send Feedback'
                >
                    <MessageSquarePlus size={16} />
                </button>
            )}

            {/* Modal Overlay */}
            {open && (
                <div className='fixed inset-0 z-50 flex items-end sm:items-center justify-center'>
                    {/* Backdrop */}
                    <div
                        className='absolute inset-0 bg-black/40 backdrop-blur-sm'
                        onClick={() => setOpen(false)}
                    />

                    {/* Modal */}
                    <div className='relative w-full sm:max-w-md mx-4 mb-4 sm:mb-0 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-in'>
                        {/* Header */}
                        <div className='flex items-center justify-between px-5 py-4 border-b border-gray-100 dark:border-gray-800'>
                            <h3 className='text-lg font-semibold text-gray-900 dark:text-white'>
                                Send Feedback
                            </h3>
                            <button
                                onClick={() => setOpen(false)}
                                className='p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors'
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {/* Body */}
                        <form
                            onSubmit={handleSubmit}
                            className='p-5 space-y-4 max-h-[80vh] overflow-y-auto'
                        >
                            {/* Category */}
                            <div className='grid grid-cols-4 gap-2'>
                                {CATEGORIES.map((cat) => {
                                    const Icon = cat.icon;
                                    return (
                                        <button
                                            key={cat.value}
                                            type='button'
                                            onClick={() =>
                                                setForm({
                                                    ...form,
                                                    category: cat.value,
                                                })
                                            }
                                            className={`flex flex-col items-center gap-1 p-2.5 rounded-xl text-xs font-medium border transition-all ${
                                                form.category === cat.value
                                                    ? 'border-violet-400 dark:border-violet-500 bg-violet-50 dark:bg-violet-500/10 text-violet-700 dark:text-violet-300'
                                                    : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'
                                            }`}
                                        >
                                            <Icon
                                                size={18}
                                                className={
                                                    form.category === cat.value
                                                        ? 'text-violet-500'
                                                        : cat.color
                                                }
                                            />
                                            {cat.label}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Name & Email */}
                            <div className='grid grid-cols-2 gap-3'>
                                <div>
                                    <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                        Name *
                                    </label>
                                    <input
                                        name='name'
                                        value={form.name}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none'
                                        placeholder='Your name'
                                    />
                                </div>
                                <div>
                                    <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                        Email *
                                    </label>
                                    <input
                                        name='email'
                                        type='email'
                                        value={form.email}
                                        onChange={handleChange}
                                        required
                                        className='w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none'
                                        placeholder='your@email.com'
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                    Subject *
                                </label>
                                <input
                                    name='subject'
                                    value={form.subject}
                                    onChange={handleChange}
                                    required
                                    className='w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none'
                                    placeholder="What's this about?"
                                />
                            </div>

                            {/* Message */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                    Message *
                                </label>
                                <textarea
                                    name='message'
                                    value={form.message}
                                    onChange={handleChange}
                                    required
                                    rows='3'
                                    minLength={10}
                                    className='w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none resize-none'
                                    placeholder='Describe the issue or share your feedback...'
                                />
                            </div>

                            {/* Contact Number (optional) */}
                            <div>
                                <label className='block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1'>
                                    Contact Number{' '}
                                    <span className='text-gray-400'>
                                        (optional)
                                    </span>
                                </label>
                                <input
                                    name='contactNumber'
                                    value={form.contactNumber}
                                    onChange={handleChange}
                                    className='w-full px-3 py-2 rounded-lg text-sm border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none'
                                    placeholder='+91 XXXXX XXXXX'
                                />
                            </div>

                            {/* Page URL auto-filled notice */}
                            <p className='text-xs text-gray-400 dark:text-gray-500'>
                                Current page URL will be attached automatically.
                            </p>

                            {/* Submit */}
                            <button
                                type='submit'
                                disabled={submitting}
                                className='w-full py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 transition-all shadow-lg shadow-violet-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2'
                            >
                                {submitting ? (
                                    <div className='w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin' />
                                ) : (
                                    <>
                                        <Send size={16} />
                                        Send Feedback
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </>
    );
}
