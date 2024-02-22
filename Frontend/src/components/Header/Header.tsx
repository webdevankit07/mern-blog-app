import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// React icons...
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { toggleTheme } from '../../store/features/theme/themeSlice';
import { deleteUserFailure, signoutUserSuccess } from '../../store/features/user/userSlice';
import { useEffect, useState } from 'react';
import { handleAxiosError } from '../../utils/utils';
import { Axios } from '../../config/api';

const Header = () => {
    const { theme } = useAppSelector((state) => state.theme);
    const { currentUser } = useAppSelector((state) => state.user);
    const [searchTerm, setSearchTerm] = useState<string>('');
    const location = useLocation();
    const path = useLocation().pathname;
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search);
        const searchTermFromUrl = urlParams.get('searchTerm');
        if (searchTermFromUrl) {
            setSearchTerm(searchTermFromUrl);
        }
    }, [location.search]);

    // SignOut User....*:
    const handleSignout = async () => {
        try {
            await Axios.post(`/user/logout/${currentUser?._id}`);
            dispatch(signoutUserSuccess());
        } catch (error) {
            const err = await handleAxiosError(error);
            dispatch(deleteUserFailure(err));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className='border-b-2'>
            <Link
                to={'/'}
                className='relative self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white'
            >
                <div className='absolute -top-3 w-[150px]'>
                    <img src='/web-universe-high-resolution-logo-transparent.png' alt='logo' />
                </div>
            </Link>
            <form onSubmit={handleSubmit}>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </form>
            <div className='flex gap-2 md:order-2'>
                <Button className='w-12 h-10' color='gray' pill onClick={() => dispatch(toggleTheme())}>
                    {theme === 'dark' ? <FaMoon /> : <FaSun />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        inline
                        arrowIcon={false}
                        label={<Avatar alt='user' img={currentUser.profilePicture} rounded />}
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.userName}</span>
                            <span className='block text-sm font-medium'>{currentUser.email}</span>
                        </Dropdown.Header>
                        {currentUser.isAdmin && (
                            <Link to={'/dashboard'}>
                                <Dropdown.Item>Dashboard</Dropdown.Item>
                            </Link>
                        )}
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>

                        <Dropdown.Item onClick={handleSignout}>
                            <span className='w-full text-center'>Sign out</span>
                        </Dropdown.Item>
                    </Dropdown>
                ) : (
                    <Link to={'/sign-in'}>
                        <Button gradientDuoTone='purpleToBlue' outline>
                            Sign In
                        </Button>
                    </Link>
                )}

                <Navbar.Toggle />
            </div>
            <Navbar.Collapse>
                <Navbar.Link active={path === '/'} as={'div'}>
                    <Link to={'/'}>Home</Link>
                </Navbar.Link>
                <Navbar.Link active={path === '/about'} as={'div'}>
                    <Link to={'/about'}>About</Link>
                </Navbar.Link>
                {currentUser?.isAdmin && (
                    <Navbar.Link active={path === '/create-post'} as={'div'}>
                        <Link to={'/create-post'}>Create</Link>
                    </Navbar.Link>
                )}
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
