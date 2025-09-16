import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import RoutesComponent from './RoutesComponent';
import Footer from './Components/Footer';
import Header from './Components/Header';

function App() {
    return (
        <ThemeProvider>
            <Router>
                <Header />
                <RoutesComponent />
                <Footer />
            </Router>
        </ThemeProvider>
    );
}

export default App;
