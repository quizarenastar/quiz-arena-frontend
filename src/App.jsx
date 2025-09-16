import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import RoutesComponent from './RoutesComponent';
import Footer from './Components/Footer';
import Header from './Components/Header';
import { Toaster } from 'react-hot-toast';

function App() {
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
