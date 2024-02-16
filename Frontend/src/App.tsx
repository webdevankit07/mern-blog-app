import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages...
import Home from './pages/Home';
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import Layout from './Layouts/Layout';
import CreatePost from './pages/CreatePost';
import PrivateRoute from './components/PrivateRoutes/PrivateRoute';
import PrivateAuthRoute from './components/PrivateRoutes/PrivateAuthRoute';
import OnlyAdminPrivateRoute from './components/PrivateRoutes/OnlyAdminPrivateRoute';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import Search from './pages/Search';

const App = () => {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route element={<PrivateRoute />}>
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/dashboard' element={<Dashboard />} />
                    </Route>
                    <Route element={<PrivateAuthRoute />}>
                        <Route path='/sign-in' element={<Signin />} />
                        <Route path='/sign-up' element={<Signup />} />
                    </Route>
                    <Route element={<OnlyAdminPrivateRoute />}>
                        <Route path='/create-post' element={<CreatePost />} />
                        <Route path='/update-post/:postId' element={<UpdatePost />} />
                    </Route>
                    <Route path='/projects' element={<Projects />} />
                    <Route path='/post/:postSlug' element={<PostPage />} />
                    <Route path='/search' element={<Search />} />
                </Route>
            </Routes>
        </Router>
    );
};

export default App;
