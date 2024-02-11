import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import DashSidebar from '../components/DashSidebar';
import DashProfile from '../components/DashBoard/DashProfile';
import DashPosts from '../components/DashBoard/DashPosts';

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
            {tab === 'profile' && <DashProfile />}
            {tab === 'posts' && <DashPosts />}
        </div>
    );
};

export default Dashboard;
