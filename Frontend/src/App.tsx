import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages...
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Layout from './Layouts/Layout';
import PrivateRoute from './components/PrivateRoute';
import PrivateAuthRoute from './components/PrivateAuthRoute';
import DashBoardLayout from './Layouts/DashBoardLayout';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/projects' element={<Projects />} />
                    </Route>
                    <Route element={<PrivateAuthRoute />}>
                        <Route path='/sign-in' element={<Signin />} />
                        <Route path='/sign-up' element={<Signup />} />
                    </Route>
                </Route>
                <Route element={<DashBoardLayout />}>
                    <Route element={<PrivateRoute />}>
                        <Route path='/dashboard' element={<Dashboard />} />
                    </Route>
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
