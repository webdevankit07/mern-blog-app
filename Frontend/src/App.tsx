import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages...
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Header from './components/Header/Header';
import Projects from './pages/Projects';

const App = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/about' element={<About />} />
                <Route path='/sign-in' element={<Signin />} />
                <Route path='/sign-up' element={<Signup />} />
                <Route path='/dashboard' element={<Dashboard />} />
                <Route path='/projects' element={<Projects />} />
            </Routes>
        </Router>
    );
};

export default App;
