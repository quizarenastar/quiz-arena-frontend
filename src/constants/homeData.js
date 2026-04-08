import { Brain, Trophy, Users, Zap } from 'lucide-react';

export const features = [
    {
        icon: Brain,
        title: 'AI-Powered Quizzes',
        description:
            'Generate unique, high-quality quizzes in seconds using advanced AI — covering any topic you choose.',
        gradient: 'from-violet-500 to-indigo-500',
    },
    {
        icon: Users,
        title: 'Community Driven',
        description:
            'Join thousands of quiz creators and participants. Share knowledge and learn together.',
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        icon: Trophy,
        title: 'Competitive Rankings',
        description:
            'Compete globally, climb the leaderboard, and prove your expertise across hundreds of categories.',
        gradient: 'from-amber-500 to-orange-500',
    },
    {
        icon: Zap,
        title: 'Live War Rooms',
        description:
            'Jump into real-time multiplayer quiz battles. Challenge friends or strangers with instant results.',
        gradient: 'from-rose-500 to-pink-500',
    },
];

export const stats = [
    { value: '50K+', label: 'Active Players' },
    { value: '10K+', label: 'Quizzes Created' },
    { value: '₹2L+', label: 'Prize Money Won' },
    // { value: '500+', label: 'Live Today' },
];

export const howItWorks = [
    {
        step: '01',
        title: 'Find or Create a Quiz',
        description:
            'Browse thousands of quizzes or use AI to generate your own in under 60 seconds.',
        gradient: 'from-indigo-500 to-violet-500',
    },
    {
        step: '02',
        title: 'Register & Compete',
        description:
            'Register for paid competitions or play free quizzes. Compete against players worldwide.',
        gradient: 'from-cyan-500 to-blue-500',
    },
    {
        step: '03',
        title: 'Win Real Prizes',
        description:
            'Top performers split the prize pool. Withdraw your winnings directly to your wallet.',
        gradient: 'from-amber-500 to-orange-500',
    },
];

export const testimonials = [
    {
        text: 'Quiz Arena has transformed how I prepare for my exams. The AI-generated quizzes are incredibly helpful and spot-on!',
        author: 'Sarah Johnson',
        role: 'Student',
        stars: 5,
        avatarColor: 'from-violet-500 to-indigo-500',
    },
    {
        text: 'As a teacher, I love creating custom quizzes for my students. The platform is intuitive, fast, and engaging.',
        author: 'Michael Chen',
        role: 'Education Professional',
        stars: 5,
        avatarColor: 'from-cyan-500 to-blue-500',
    },
    {
        text: "The competitive aspect keeps me coming back. Won ₹3,000 last week! It's both fun and rewarding.",
        author: 'Alex Rivera',
        role: 'Quiz Enthusiast',
        stars: 5,
        avatarColor: 'from-amber-500 to-orange-500',
    },
];
