import { BrowserRouter as Router } from 'react-router-dom';
import RoutesComponent from './RoutesComponent';
import Footer from './Components/Footer';
import Header from './Components/Header';
function App() {
    return (
        <Router>
            <Header />
            <RoutesComponent />
            <Footer />
        </Router>
    );
}

export default App;
