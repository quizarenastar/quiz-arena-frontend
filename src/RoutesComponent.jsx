import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Quizzes from './Pages/Quizzes';
import Profile from './Pages/Profile';
import PrivacyPolicy from './Pages/PrivacyPolicy';
import TermsAndConditions from './Pages/TermsAndConditions';
import AboutUs from './Pages/AboutUs';
import ContactUs from './Pages/ContactUs';
import NotFound from './Pages/NotFound';
import CreateQuiz from './Pages/CreateQuiz';
import MyQuizzes from './Pages/MyQuizzes';
import MyAttempts from './Pages/MyAttempts';
import QuizDetails from './Pages/QuizDetails';
import QuizAttempt from './Pages/QuizAttempt';
import QuizResult from './Pages/QuizResult';
import Wallet from './Pages/Wallet';
import Leaderboard from './Pages/Leaderboard';
import WarRooms from './Pages/WarRooms';
import WarRoom from './Pages/WarRoom';
import WarRoomHistory from './Pages/WarRoomHistory';
import ProtectedRoute from './Components/ProtectedRoute';

export default function RoutesComponent() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/quizzes' element={<Quizzes />} />
            <Route path='/profile' element={<Profile />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route
                path='/terms-and-conditions'
                element={<TermsAndConditions />}
            />
            <Route path='/about-us' element={<AboutUs />} />
            <Route path='/contact-us' element={<ContactUs />} />
            <Route path='*' element={<NotFound />} />

            {/* Protected Routes */}
            <Route
                path='/create-quiz'
                element={
                    <ProtectedRoute>
                        <CreateQuiz />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/my-quizzes'
                element={
                    <ProtectedRoute>
                        <MyQuizzes />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/my-attempts'
                element={
                    <ProtectedRoute>
                        <MyAttempts />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/quiz/:quizId'
                element={
                    <ProtectedRoute>
                        <QuizDetails />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/quiz/:quizId/attempt'
                element={
                    <ProtectedRoute>
                        <QuizAttempt />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/quiz/:quizId/result/:attemptId'
                element={
                    <ProtectedRoute>
                        <QuizResult />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/wallet'
                element={
                    <ProtectedRoute>
                        <Wallet />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/quiz/:quizId/leaderboard'
                element={<Leaderboard />}
            />
            <Route
                path='/war-rooms'
                element={
                    <ProtectedRoute>
                        <WarRooms />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/war-rooms/:roomCode'
                element={
                    <ProtectedRoute>
                        <WarRoom />
                    </ProtectedRoute>
                }
            />
            <Route
                path='/war-rooms/:roomId/history'
                element={
                    <ProtectedRoute>
                        <WarRoomHistory />
                    </ProtectedRoute>
                }
            />
        </Routes>
    );
}
