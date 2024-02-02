import { Avatar, Button, Dropdown, Navbar, TextInput } from 'flowbite-react';
import { Link, useLocation } from 'react-router-dom';

// React icons...
import { AiOutlineSearch } from 'react-icons/ai';
import { FaMoon } from 'react-icons/fa';
import { useAppSelector } from '../../store/storeHooks';

const Header = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const path = useLocation().pathname;

    return (
        <Navbar className='border-b-2'>
            <Link to={'/'} className='self-center text-sm font-semibold whitespace-nowrap sm:text-xl dark:text-white'>
                <span className='px-2 py-1 mr-0.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
                    Ankit's
                </span>
                Blog
            </Link>
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
                <Button className='hidden w-12 h-10 sm:inline' color='gray' pill>
                    <FaMoon />
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

export default Header;
