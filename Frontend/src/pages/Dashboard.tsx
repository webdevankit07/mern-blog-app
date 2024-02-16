import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashProfile from '../components/DashBoard/DashProfile';
import DashPosts from '../components/DashBoard/DashPosts';
import DashSidebar from '../components/DashBoard/DashSidebar';
import DashUsers from '../components/DashBoard/DashUsers';
import DashComments from '../components/DashBoard/DashComments';
import DashBoardComp from '../components/DashBoard/DashBoardComp';

const Dashboard = () => {
    const location = useLocation();
    const [tab, setTab] = useState<string | null>();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        setTab(tabFromUrl);
    }, [location.search]);

    return (
        <div className='flex flex-col md:flex-row'>
            <div className='md:min-h-screen min-w-56'>
                <DashSidebar />
            </div>
            {tab === null && <DashBoardComp />}
            {tab === 'profile' && <DashProfile />}
            {tab === 'posts' && <DashPosts />}
            {tab === 'users' && <DashUsers />}
            {tab === 'comments' && <DashComments />}
        </div>
    );
};

export default Dashboard;
