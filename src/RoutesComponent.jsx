import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home';
import Login from './Pages/Login';
import Signup from './Pages/Signup';
import Quizzes from './Pages/Quizzes';
import Profile from './Pages/Profile';

export default function RoutesComponent() {
    return (
        <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/login' element={<Login />} />
            <Route path='/signup' element={<Signup />} />
            <Route path='/quizzes' element={<Quizzes />} />
            <Route path='/profile' element={<Profile />} />
        </Routes>
    );
}
