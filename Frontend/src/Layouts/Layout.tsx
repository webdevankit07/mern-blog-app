import { Outlet } from 'react-router-dom';
import Header from '../components/Header/Header';
import FooterCom from '../components/Footer/Footer';
import ScrollToTop from '../components/ScrollToTop';

const Layout = () => {
    return (
        <div className='flex flex-col min-h-screen'>
            <ScrollToTop />
            <Header />
            <div className='flex-1'>
                <Outlet />
            </div>
            <FooterCom />
        </div>
    );
};

export default Layout;
