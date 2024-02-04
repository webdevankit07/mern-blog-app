import { Outlet } from 'react-router-dom';
import FooterCom from '../components/Footer/Footer';
import Header from '../components/Header/Header';

const DashBoardLayout = () => {
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

export default DashBoardLayout;
