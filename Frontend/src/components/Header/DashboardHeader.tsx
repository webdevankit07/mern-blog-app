import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';

// React icons...
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon, FaSun } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { toggleTheme } from '../../store/features/theme/themeSlice';

const DashBoardHeader = () => {
    const { theme } = useAppSelector((state) => state.theme);
    const { currentUser } = useAppSelector((state) => state.user);
    const path = useLocation().pathname;
    const dispatch = useAppDispatch();

    return (
        <Navbar className='bg-gray-50'>
            <form>
                <TextInput
                    type='text'
                    placeholder='Search...'
                    rightIcon={AiOutlineSearch}
                    className='hidden lg:inline'
                />
            </form>
            <Button className='w-12 h-10 lg:hidden' color='gray' pill>
                <AiOutlineSearch />
            </Button>
            <div className='flex gap-2 md:order-2'>
                <Button
                    className='hidden w-12 h-10 sm:inline'
                    color='gray'
                    pill
                    onClick={() => dispatch(toggleTheme())}
                >
                    {theme === 'dark' ? <FaMoon /> : <FaSun />}
                </Button>
                {currentUser ? (
                    <Dropdown
                        inline
                        arrowIcon={false}
                        label={<Avatar alt='user' img={currentUser.profilePicutre} rounded />}
                    >
                        <Dropdown.Header>
                            <span className='block text-sm'>@{currentUser.userName}</span>
                            <span className='block text-sm font-medium'>{currentUser.email}</span>
                        </Dropdown.Header>
                        <Link to={'/dashboard?tab=profile'}>
                            <Dropdown.Item>Profile</Dropdown.Item>
                        </Link>

                        <Dropdown.Item>
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

export default DashBoardHeader;
