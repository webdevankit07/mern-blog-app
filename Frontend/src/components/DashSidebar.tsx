import axios from 'axios';
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiArrowSmRight, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { deleteUserFailure, signoutUserSuccess } from '../store/features/user/userSlice';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

const DashSidebar = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const location = useLocation();
    const [tab, setTab] = useState<string | null>();
    const dispatch = useAppDispatch();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const tabFromUrl = urlParams.get('tab');
        setTab(tabFromUrl);
    }, [location.search]);

    // SignOut User....*:
    const handleSignout = async () => {
        try {
            await axios.post(`/api/v1/user/logout/${currentUser?._id}`);
            dispatch(signoutUserSuccess());
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                console.log(error.response?.data.message);
                dispatch(deleteUserFailure(error.response?.data.message));
            } else {
                const err = error as Error;
                console.log(err);
                dispatch(deleteUserFailure(err.message));
            }
        }
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup>
                    <Link to={`/dashboard?tab=profile`}>
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={'User'}
                            labelColor='dark'
                            className='cursor-pointer'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    <Sidebar.Item
                        icon={HiArrowSmRight}
                        labelColor='dark'
                        className='cursor-pointer'
                        onClick={handleSignout}
                    >
                        Sign Out
                    </Sidebar.Item>
                </Sidebar.ItemGroup>
            </Sidebar.Items>
        </Sidebar>
    );
};

export default DashSidebar;
