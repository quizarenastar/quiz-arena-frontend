import { useEffect } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { ThemeProvider } from './context/ThemeContext';
import RoutesComponent from './RoutesComponent';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { Toaster } from 'react-hot-toast';
import { fetchProfileThunk } from './store/slices/authSlice';

function App() {
    const dispatch = useDispatch();
    const { isAuthenticated } = useSelector((s) => s.auth);

    // Validate session on app startup — if persisted state says
    // we're logged in, verify with the backend that the token is still valid.
    useEffect(() => {
        if (isAuthenticated) {
            dispatch(fetchProfileThunk());
        }
    }, []); // Only run once on mount

    return (
        <ThemeProvider>
            <Router>
                <Header />
                <RoutesComponent />
                <Footer />
                <Toaster position="top-right" />
            </Router>
        </ThemeProvider>
    );
}

export default App;

