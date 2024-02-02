import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import FooterCom from '../components/Footer/Footer';

const MainLayout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <Header />
            <div className='flex-1'>
                <Outlet />
            </div>
            <FooterCom />
        </div>
    );
};

export default MainLayout;
