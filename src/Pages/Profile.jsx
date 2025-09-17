import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    fetchProfileThunk,
    updateProfileThunk,
} from '../store/slices/authSlice';
import {
    Camera,
    Mail,
    DollarSign,
    Coins,
    Shield,
    Edit2,
    Save,
} from 'lucide-react';
import toast from 'react-hot-toast';

export default function Profile() {
    const dispatch = useDispatch();
    const { user } = useSelector((s) => s.auth);
    const [editing, setEditing] = useState(false);
    const [form, setForm] = useState({
        username: '',
        email: '',
        password: '',
        profilePicture: '',
    });

    useEffect(() => {
        dispatch(fetchProfileThunk());
    }, [dispatch]);

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username || '',
                email: user.email || '',
                password: '',
                profilePicture: user.profilePicture || '',
            });
        }
    }, [user]);

    const onSave = async () => {
        const payload = { username: form.username, email: form.email };
        if (form.password) payload.password = form.password;
        if (form.profilePicture !== undefined)
            payload.profilePicture = form.profilePicture;
        const action = await dispatch(updateProfileThunk(payload));
        if (updateProfileThunk.fulfilled.match(action)) {
            toast.success('Profile updated');
            setEditing(false);
        } else {
            toast.error(action.payload || 'Update failed');
        }
    };

    const avatar = () => {
        if (form.profilePicture)
            return (
                <img
                    src={form.profilePicture}
                    alt='avatar'
                    className='w-24 h-24 rounded-full object-cover border'
                />
            );
        const letter = (form.username || 'U').charAt(0).toUpperCase();
        return (
            <div className='w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-white flex items-center justify-center text-3xl font-bold'>
                {letter}
            </div>
        );
    };

    return (
        <div className='min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-blue-900 dark:to-indigo-900 p-6'>
            <div className='max-w-3xl mx-auto'>
                <div className='backdrop-blur-lg bg-white/70 dark:bg-gray-800/70 rounded-3xl shadow-2xl border border-white/20 dark:border-gray-700/50 overflow-hidden'>
                    <div className='p-8 flex flex-col sm:flex-row items-center gap-6'>
                        {avatar()}
                        <div className='flex-1'>
                            <h1 className='text-3xl font-bold text-gray-900 dark:text-white'>
                                {user?.username || 'User'}
                            </h1>
                            <div className='flex items-center gap-2 text-gray-600 dark:text-gray-300 mt-1'>
                                <Mail size={18} /> {user?.email}
                            </div>
                            <div className='mt-4 flex flex-wrap gap-4'>
                                <div className='px-4 py-3 rounded-2xl bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-200 flex items-center gap-2'>
                                    <Coins size={18} /> Current Balance:{' '}
                                    <span className='font-semibold'>
                                        {user?.currentBalance ?? 0}
                                    </span>
                                </div>
                                <div className='px-4 py-3 rounded-2xl bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-200 flex items-center gap-2'>
                                    <DollarSign size={18} /> Total Earn:{' '}
                                    <span className='font-semibold'>
                                        {user?.totalEarn ?? 0}
                                    </span>
                                </div>
                                <div className='px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-200 flex items-center gap-2'>
                                    <Shield size={18} /> Total Redeem:{' '}
                                    <span className='font-semibold'>
                                        {user?.totalRedeem ?? 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className='px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow hover:shadow-md flex items-center gap-2'
                                >
                                    <Edit2 size={18} /> Edit Profile
                                </button>
                            ) : (
                                <button
                                    onClick={onSave}
                                    className='px-4 py-2 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow hover:shadow-md flex items-center gap-2'
                                >
                                    <Save size={18} /> Save Changes
                                </button>
                            )}
                        </div>
                    </div>
                    <div className='px-8 pb-8 grid grid-cols-1 md:grid-cols-2 gap-6'>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                Username
                            </label>
                            <input
                                disabled={!editing}
                                value={form.username}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        username: e.target.value,
                                    })
                                }
                                className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/50 border ${
                                    editing
                                        ? 'border-blue-300 dark:border-blue-700'
                                        : 'border-gray-200 dark:border-gray-700'
                                } focus:outline-none`}
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                Email
                            </label>
                            <input
                                disabled={!editing}
                                value={form.email}
                                onChange={(e) =>
                                    setForm({ ...form, email: e.target.value })
                                }
                                className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/50 border ${
                                    editing
                                        ? 'border-blue-300 dark:border-blue-700'
                                        : 'border-gray-200 dark:border-gray-700'
                                } focus:outline-none`}
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                New Password
                            </label>
                            <input
                                type='password'
                                disabled={!editing}
                                value={form.password}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        password: e.target.value,
                                    })
                                }
                                className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/50 border ${
                                    editing
                                        ? 'border-blue-300 dark:border-blue-700'
                                        : 'border-gray-200 dark:border-gray-700'
                                } focus:outline-none`}
                                placeholder='Leave blank to keep current'
                            />
                        </div>
                        <div>
                            <label className='block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2'>
                                Profile Picture URL
                            </label>
                            <input
                                disabled={!editing}
                                value={form.profilePicture}
                                onChange={(e) =>
                                    setForm({
                                        ...form,
                                        profilePicture: e.target.value,
                                    })
                                }
                                className={`w-full px-4 py-3 rounded-2xl bg-white/60 dark:bg-gray-700/50 border ${
                                    editing
                                        ? 'border-blue-300 dark:border-blue-700'
                                        : 'border-gray-200 dark:border-gray-700'
                                } focus:outline-none`}
                                placeholder='https://...'
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
