import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Pages...
import About from './pages/About';
import Signin from './pages/Signin';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Layout from './Layouts/Layout';
import CreatePost from './pages/CreatePost';
import PrivateRoute from './components/PrivateRoutes/PrivateRoute';
import PrivateAuthRoute from './components/PrivateRoutes/PrivateAuthRoute';
import OnlyAdminPrivateRoute from './components/PrivateRoutes/OnlyAdminPrivateRoute';
import UpdatePost from './pages/UpdatePost';
import PostPage from './pages/PostPage';
import Search from './pages/Search';
import Home from './pages/Home';
import Error from './pages/Error';
import { useEffect } from 'react';
import { Axios } from './config/api';
import { handleAxiosError } from './utils/utils';
import { useAppDispatch } from './store/storeHooks';
import { setUserState } from './store/features/user/userSlice';
import { SkeletonTheme } from 'react-loading-skeleton';

const App = () => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        (async () => {
            try {
                const {
                    data: { data },
                } = await Axios.get('/auth/validate-token');
                dispatch(setUserState(data.user));
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
                dispatch(setUserState(null));
            }
        })();
    }, [dispatch]);

    return (
        <SkeletonTheme baseColor='#313131' highlightColor='#525252'>
            <Router>
                <Routes>
                    <Route element={<Layout />}>
                        <Route element={<PrivateRoute />}>
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
                        <Route path='/' element={<Home />} />
                        <Route path='/about' element={<About />} />
                        <Route path='/post/:postSlug' element={<PostPage />} />
                        <Route path='/search' element={<Search />} />
                        <Route path='*' element={<Error />} />
                    </Route>
                </Routes>
            </Router>
        </SkeletonTheme>
    );
};

export default App;
