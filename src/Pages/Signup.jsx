import { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';
import {
    googleThunk,
    sendOtpThunk,
    signupThunk,
} from '../store/slices/authSlice';
import toast from 'react-hot-toast';
import {
    Mail,
    Lock,
    User,
    Eye,
    EyeOff,
    ArrowLeft,
    ShieldCheck,
} from 'lucide-react';

export default function Signup() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const [step, setStep] = useState(1); // 1 = form, 2 = OTP
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [errors, setErrors] = useState({});
    const [showPassword, setShowPassword] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState(0);
    const [googleLoading, setGoogleLoading] = useState(false);
    const [otpSending, setOtpSending] = useState(false);
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [otp, setOtp] = useState(['', '', '', '', '', '']);
    const [countdown, setCountdown] = useState(0);
    const otpRefs = useRef([]);
    const from = location.state?.from?.pathname || '/';

    // Countdown timer for resend
    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    // Calculate password strength
    const calculatePasswordStrength = (password) => {
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });

        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }

        if (name === 'password') {
            setPasswordStrength(calculatePasswordStrength(value));
        }
    };

    // Step 1: Send OTP
    const handleSendOtp = async (e) => {
        e.preventDefault();

        const newErrors = {};
        if (!formData.username.trim())
            newErrors.username = 'Username is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        if (!formData.password) newErrors.password = 'Password is required';
        if (formData.password.length < 6)
            newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setOtpSending(true);
        try {
            const action = await dispatch(
                sendOtpThunk({
                    email: formData.email,
                    username: formData.username,
                }),
            );
            if (sendOtpThunk.fulfilled.match(action)) {
                toast.success('OTP sent to your email!');
                setStep(2);
                setCountdown(60);
                // Auto-focus first OTP input
                setTimeout(() => otpRefs.current[0]?.focus(), 100);
            } else {
                toast.error(action.payload || 'Failed to send OTP');
            }
        } catch (err) {
            console.log(err);
            toast.error('An error occurred');
        } finally {
            setOtpSending(false);
        }
    };

    // Step 2: Verify OTP & signup
    const handleVerifyOtp = async () => {
        const otpCode = otp.join('');
        if (otpCode.length !== 6) {
            toast.error('Please enter the 6-digit OTP');
            return;
        }

        setOtpVerifying(true);
        try {
            const action = await dispatch(
                signupThunk({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password,
                    otp: otpCode,
                }),
            );
            if (signupThunk.fulfilled.match(action)) {
                toast.success('Account created successfully!');
                navigate('/login');
            } else {
                toast.error(action.payload || 'Verification failed');
            }
        } catch (err) {
            console.log(err);
            toast.error('An error occurred');
        } finally {
            setOtpVerifying(false);
        }
    };

    // Resend OTP
    const handleResendOtp = async () => {
        if (countdown > 0) return;
        setOtpSending(true);
        try {
            const action = await dispatch(
                sendOtpThunk({
                    email: formData.email,
                    username: formData.username,
                }),
            );
            if (sendOtpThunk.fulfilled.match(action)) {
                toast.success('OTP resent!');
                setCountdown(60);
                setOtp(['', '', '', '', '', '']);
                otpRefs.current[0]?.focus();
            } else {
                toast.error(action.payload || 'Failed to resend OTP');
            }
        } catch {
            toast.error('An error occurred');
        } finally {
            setOtpSending(false);
        }
    };

    // OTP input handlers
    const handleOtpChange = (index, value) => {
        // Only allow digits
        if (value && !/^\d$/.test(value)) return;

        const newOtp = [...otp];
        newOtp[index] = value;
        setOtp(newOtp);

        // Auto-advance to next field
        if (value && index < 5) {
            otpRefs.current[index + 1]?.focus();
        }

        // Auto-submit when all 6 digits entered
        if (value && index === 5 && newOtp.every((d) => d !== '')) {
            setTimeout(() => handleVerifyOtp(), 200);
        }
    };

    const handleOtpKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            otpRefs.current[index - 1]?.focus();
        }
        if (e.key === 'Enter') {
            handleVerifyOtp();
        }
    };

    const handleOtpPaste = (e) => {
        e.preventDefault();
        const pasted = e.clipboardData
            .getData('text')
            .replace(/\D/g, '')
            .slice(0, 6);
        if (pasted.length === 0) return;
        const newOtp = [...otp];
        for (let i = 0; i < 6; i++) {
            newOtp[i] = pasted[i] || '';
        }
        setOtp(newOtp);
        // Focus last filled or next empty
        const focusIdx = Math.min(pasted.length, 5);
        otpRefs.current[focusIdx]?.focus();
    };

    // Initialize Google Identity Services
    useEffect(() => {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
        if (!clientId) {
            console.warn('VITE_GOOGLE_CLIENT_ID is not set');
            return;
        }
        if (window.google?.accounts?.id) {
            window.google.accounts.id.initialize({
                client_id: clientId,
                callback: async (response) => {
                    setGoogleLoading(true);
                    try {
                        const base64Url = response.credential.split('.')[1];
                        const base64 = base64Url
                            .replace(/-/g, '+')
                            .replace(/_/g, '/');
                        const jsonPayload = decodeURIComponent(
                            atob(base64)
                                .split('')
                                .map(function (c) {
                                    return (
                                        '%' +
                                        (
                                            '00' + c.charCodeAt(0).toString(16)
                                        ).slice(-2)
                                    );
                                })
                                .join(''),
                        );
                        const payload = JSON.parse(jsonPayload);
                        const name = payload.name || payload.given_name || '';
                        const email = payload.email;
                        const action = await dispatch(
                            googleThunk({ email, name }),
                        );
                        if (googleThunk.fulfilled.match(action)) {
                            toast.success('Signed up with Google');
                            navigate(from, { replace: true });
                        } else {
                            toast.error(
                                action.payload || 'Google sign-up failed',
                            );
                        }
                    } catch (e) {
                        console.log(e);
                        toast.error('Google sign-up failed');
                    } finally {
                        setGoogleLoading(false);
                    }
                },
            });
        }
    }, [dispatch, navigate, from]);

    const handleGoogleLogin = () => {
        if (window.google?.accounts?.id) {
            setGoogleLoading(true);
            window.google.accounts.id.prompt((notification) => {
                if (
                    notification.isNotDisplayed() ||
                    notification.isSkippedMoment() ||
                    notification.isDismissedMoment()
                ) {
                    setGoogleLoading(false);
                }
            });
        } else {
            console.warn('Google Identity script not loaded');
        }
    };

    const getPasswordStrengthColor = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'bg-red-500';
            case 2:
                return 'bg-yellow-500';
            case 3:
                return 'bg-blue-500';
            case 4:
            case 5:
                return 'bg-green-500';
            default:
                return 'bg-gray-300';
        }
    };

    const getPasswordStrengthText = () => {
        switch (passwordStrength) {
            case 0:
            case 1:
                return 'Weak';
            case 2:
                return 'Fair';
            case 3:
                return 'Good';
            case 4:
            case 5:
                return 'Strong';
            default:
                return '';
        }
    };

    return (
        <div className='min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-blue to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 py-8 px-4 sm:px-4 lg:px-6 transition-all duration-300'>
            {/* Background decoration */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'></div>

            <div className='max-w-md w-full space-y-8 relative z-10'>
                {/* Header */}
                <div className='text-center'>
                    <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                        {step === 1 ? 'Sign Up' : 'Verify Email'}
                    </h2>
                    {step === 2 && (
                        <p className='text-sm text-gray-500 dark:text-gray-400'>
                            We sent a 6-digit code to{' '}
                            <span className='font-medium text-blue-600 dark:text-blue-400'>
                                {formData.email}
                            </span>
                        </p>
                    )}
                </div>

                {/* Form card */}
                <div className='bg-white dark:bg-gray-800/50 backdrop-blur-sm rounded-3xl shadow-2xl dark:shadow-gray-900/20 border border-gray-200 dark:border-gray-700/50 p-8'>
                    {step === 1 ? (
                        /* ───────────── STEP 1: Registration form ───────────── */
                        <div className='space-y-4'>
                            {/* Username field */}
                            <div className='space-y-2'>
                                <div className='relative group'>
                                    <User
                                        className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                        size={20}
                                    />
                                    <input
                                        type='text'
                                        name='username'
                                        required
                                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                        placeholder='Choose a username'
                                        value={formData.username}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.username && (
                                    <p className='text-xs text-red-500 ml-1'>
                                        {errors.username}
                                    </p>
                                )}
                            </div>

                            {/* Email field */}
                            <div className='space-y-2'>
                                <div className='relative group'>
                                    <Mail
                                        className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                        size={20}
                                    />
                                    <input
                                        type='email'
                                        name='email'
                                        required
                                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                        placeholder='Enter your email'
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.email && (
                                    <p className='text-xs text-red-500 ml-1'>
                                        {errors.email}
                                    </p>
                                )}
                            </div>

                            {/* Password field */}
                            <div className='space-y-2'>
                                <div className='relative group'>
                                    <Lock
                                        className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                        size={20}
                                    />
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name='password'
                                        required
                                        className='w-full pl-12 pr-12 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                        placeholder='Create a password'
                                        value={formData.password}
                                        onChange={handleChange}
                                    />
                                    <button
                                        type='button'
                                        onClick={() =>
                                            setShowPassword(!showPassword)
                                        }
                                        className='absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200'
                                    >
                                        {showPassword ? (
                                            <EyeOff size={20} />
                                        ) : (
                                            <Eye size={20} />
                                        )}
                                    </button>
                                </div>
                                {errors.password && (
                                    <p className='text-xs text-red-500 ml-1'>
                                        {errors.password}
                                    </p>
                                )}

                                {/* Password strength indicator */}
                                {formData.password && (
                                    <div className='mt-2'>
                                        <div className='flex items-center justify-between mb-1'>
                                            <span className='text-xs text-gray-500 dark:text-gray-400'>
                                                Password strength
                                            </span>
                                            <span
                                                className={`text-xs font-medium ${
                                                    passwordStrength >= 3
                                                        ? 'text-blue-600 dark:text-blue-400'
                                                        : passwordStrength >= 2
                                                          ? 'text-blue-600 dark:text-blue-400'
                                                          : 'text-red-600 dark:text-red-400'
                                                }`}
                                            >
                                                {getPasswordStrengthText()}
                                            </span>
                                        </div>
                                        <div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
                                            <div
                                                className={`h-2 rounded-full transition-all duration-300 ${getPasswordStrengthColor()}`}
                                                style={{
                                                    width: `${
                                                        (passwordStrength / 5) *
                                                        100
                                                    }%`,
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Confirm password field */}
                            <div className='space-y-2'>
                                <div className='relative group'>
                                    <Lock
                                        className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500 group-focus-within:text-blue-500 transition-colors duration-200'
                                        size={20}
                                    />
                                    <input
                                        type={
                                            showPassword ? 'text' : 'password'
                                        }
                                        name='confirmPassword'
                                        required
                                        className='w-full pl-12 pr-4 py-4 bg-gray-50 dark:bg-gray-700/50 border border-gray-300 dark:border-gray-600 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-200'
                                        placeholder='Confirm password'
                                        value={formData.confirmPassword}
                                        onChange={handleChange}
                                    />
                                </div>
                                {errors.confirmPassword && (
                                    <p className='text-xs text-red-500 ml-1'>
                                        {errors.confirmPassword}
                                    </p>
                                )}
                            </div>

                            {/* Send OTP button */}
                            <button
                                type='submit'
                                onClick={handleSendOtp}
                                disabled={otpSending}
                                className={`w-full bg-gradient-to-r from-gray-400 to-blue-600 hover:from-gray-700 hover:to-blue-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                                    otpSending
                                        ? 'opacity-60 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {otpSending ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg
                                            className='animate-spin h-5 w-5'
                                            viewBox='0 0 24 24'
                                        >
                                            <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='4'
                                                fill='none'
                                            />
                                            <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                            />
                                        </svg>
                                        Sending OTP…
                                    </span>
                                ) : (
                                    'Continue'
                                )}
                            </button>

                            {/* Divider */}
                            <div className='relative'>
                                <div className='absolute inset-0 flex items-center'>
                                    <div className='w-full border-t border-gray-300 dark:border-gray-600'></div>
                                </div>
                                <div className='relative flex justify-center text-sm'>
                                    <span className='px-4 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400'>
                                        Or continue with
                                    </span>
                                </div>
                            </div>

                            {/* Google signup */}
                            <button
                                type='button'
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className={`w-full flex items-center justify-center px-6 py-4 border border-gray-300 dark:border-gray-600 rounded-2xl shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700/50 hover:bg-gray-50 dark:hover:bg-gray-700 hover:shadow-md transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                                    googleLoading
                                        ? 'opacity-60 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {!googleLoading && (
                                    <svg
                                        className='w-5 h-5 mr-3'
                                        viewBox='0 0 24 24'
                                    >
                                        <path
                                            fill='#4285F4'
                                            d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
                                        />
                                        <path
                                            fill='#34A853'
                                            d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
                                        />
                                        <path
                                            fill='#FBBC05'
                                            d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
                                        />
                                        <path
                                            fill='#EA4335'
                                            d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
                                        />
                                    </svg>
                                )}
                                {googleLoading
                                    ? 'Continuing…'
                                    : 'Sign up with Google'}
                            </button>
                        </div>
                    ) : (
                        /* ───────────── STEP 2: OTP Verification ───────────── */
                        <div className='space-y-6'>
                            {/* Shield icon */}
                            <div className='flex justify-center'>
                                <div className='w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center'>
                                    <ShieldCheck className='w-8 h-8 text-blue-600 dark:text-blue-400' />
                                </div>
                            </div>

                            {/* OTP Input boxes */}
                            <div className='flex justify-center gap-3'>
                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        ref={(el) =>
                                            (otpRefs.current[idx] = el)
                                        }
                                        type='text'
                                        inputMode='numeric'
                                        maxLength={1}
                                        value={digit}
                                        onChange={(e) =>
                                            handleOtpChange(idx, e.target.value)
                                        }
                                        onKeyDown={(e) =>
                                            handleOtpKeyDown(idx, e)
                                        }
                                        onPaste={
                                            idx === 0
                                                ? handleOtpPaste
                                                : undefined
                                        }
                                        className='w-12 h-14 text-center text-xl font-bold bg-gray-50 dark:bg-gray-700/50 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:ring-blue-400 dark:focus:border-blue-400 text-gray-900 dark:text-white transition-all duration-200'
                                    />
                                ))}
                            </div>

                            {/* Verify button */}
                            <button
                                onClick={handleVerifyOtp}
                                disabled={
                                    otpVerifying || otp.join('').length !== 6
                                }
                                className={`w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 ${
                                    otpVerifying || otp.join('').length !== 6
                                        ? 'opacity-60 cursor-not-allowed'
                                        : ''
                                }`}
                            >
                                {otpVerifying ? (
                                    <span className='flex items-center justify-center gap-2'>
                                        <svg
                                            className='animate-spin h-5 w-5'
                                            viewBox='0 0 24 24'
                                        >
                                            <circle
                                                className='opacity-25'
                                                cx='12'
                                                cy='12'
                                                r='10'
                                                stroke='currentColor'
                                                strokeWidth='4'
                                                fill='none'
                                            />
                                            <path
                                                className='opacity-75'
                                                fill='currentColor'
                                                d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                                            />
                                        </svg>
                                        Verifying…
                                    </span>
                                ) : (
                                    'Verify & Create Account'
                                )}
                            </button>

                            {/* Resend & Back */}
                            <div className='flex items-center justify-between text-sm'>
                                <button
                                    onClick={() => {
                                        setStep(1);
                                        setOtp(['', '', '', '', '', '']);
                                    }}
                                    className='flex items-center gap-1 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors duration-200'
                                >
                                    <ArrowLeft size={16} />
                                    Back
                                </button>

                                <button
                                    onClick={handleResendOtp}
                                    disabled={countdown > 0 || otpSending}
                                    className={`font-medium transition-colors duration-200 ${
                                        countdown > 0
                                            ? 'text-gray-400 dark:text-gray-500 cursor-not-allowed'
                                            : 'text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300'
                                    }`}
                                >
                                    {otpSending
                                        ? 'Sending…'
                                        : countdown > 0
                                          ? `Resend in ${countdown}s`
                                          : 'Resend OTP'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Sign in link */}
                    <div className='mt-6 text-center'>
                        <p className='text-sm text-gray-600 dark:text-gray-400'>
                            Already have an account?{' '}
                            <a
                                href='/login'
                                className='font-medium text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 transition-colors duration-200'
                            >
                                Sign in
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
