import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

// React icons...
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { toggleTheme } from '../../store/features/theme/themeSlice';
import { deleteUserFailure, signoutUserSuccess } from '../../store/features/user/userSlice';
import axios from 'axios';
import { useEffect, useState } from 'react';

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

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

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', searchTerm);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };

    return (
        <Navbar className='border-b-2'>
            <Link to={'/'} className='self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white'>
                <span className='px-2 py-1 mr-0.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
                    Ankit's
                </span>
                Blog
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
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
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
                <Navbar.Link active={path === '/projects'} as={'div'}>
                    <Link to={'/projects'}>Projects</Link>
                </Navbar.Link>
            </Navbar.Collapse>
        </Navbar>
    );
};

export default Header;
