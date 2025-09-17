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
        </Routes>
    );
}
