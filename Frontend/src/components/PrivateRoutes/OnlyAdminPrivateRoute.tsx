import { Navigate, Outlet } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';

const OnlyAdminPrivateRoute = () => {
    const { currentUser } = useAppSelector((state) => state.user);

    return currentUser?.isAdmin ? <Outlet /> : <Navigate to={'/sign-in'} />;
};

export default OnlyAdminPrivateRoute;
