import axios from 'axios';
import { Sidebar } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { HiAnnotation, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiUser } from 'react-icons/hi';
import { Link, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { deleteUserFailure, signoutUserSuccess } from '../../store/features/user/userSlice';
import { handleAxiosError } from '../../utils/utils';

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
            const err = await handleAxiosError(error);
            dispatch(deleteUserFailure(err));
        }
    };

    return (
        <Sidebar className='w-full md:w-56'>
            <Sidebar.Items>
                <Sidebar.ItemGroup className='flex flex-col gap-1'>
                    <Link to={`/dashboard?tab=profile`}>
                        <Sidebar.Item
                            active={tab === 'profile'}
                            icon={HiUser}
                            label={currentUser?.isAdmin ? 'Admin' : 'User'}
                            labelColor='dark'
                            className='cursor-pointer'
                            as='div'
                        >
                            Profile
                        </Sidebar.Item>
                    </Link>
                    {currentUser?.isAdmin && (
                        <Link to={`/dashboard?tab=posts`}>
                            <Sidebar.Item
                                active={tab === 'posts'}
                                icon={HiDocumentText}
                                className='cursor-pointer'
                                as='div'
                            >
                                Posts
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser?.isAdmin && (
                        <Link to={`/dashboard?tab=users`}>
                            <Sidebar.Item
                                active={tab === 'users'}
                                icon={HiOutlineUserGroup}
                                className='cursor-pointer'
                                as='div'
                            >
                                Users
                            </Sidebar.Item>
                        </Link>
                    )}
                    {currentUser?.isAdmin && (
                        <Link to={`/dashboard?tab=comments`}>
                            <Sidebar.Item
                                active={tab === 'comments'}
                                icon={HiAnnotation}
                                className='cursor-pointer'
                                as='div'
                            >
                                Comments
                            </Sidebar.Item>
                        </Link>
                    )}
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
