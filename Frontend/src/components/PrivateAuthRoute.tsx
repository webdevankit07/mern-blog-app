import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../store/storeHooks';

const PrivateAuthRoute = () => {
    const { currentUser } = useAppSelector((state) => state.user);

    return currentUser ? <Navigate to={'/'} /> : <Outlet />;
};

export default PrivateAuthRoute;
