import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/storeHooks';
import Posts from '../components/Posts';

const Home = () => {
    const { currentUser } = useAppSelector((state) => state.user);

    return (
        <div>
            <div className='flex flex-col max-w-6xl gap-6 px-3 mx-auto p-28 '>
                <h1 className='text-3xl font-bold lg:text-6xl'>
                    Welcome {currentUser ? currentUser?.fullName : 'to Web Universe'}
                </h1>
                <h2 className='text-lg font-semibold'>
                    Web Universe: Exploring webTech, Space,Science Frontiers and Bizare Facts
                </h2>
                <p className='text-xs text-gray-500 sm:text-sm'>
                    "Welcome to the Web Universe, where programming prowess meets cosmic curiosity. Dive into
                    cutting-edge insights across Bizare Facts, programming, space exploration, computer science, and web
                    development, unlocking the frontiers of innovation"
                </p>
                <Link to='/search' className='text-xs font-bold text-teal-500 sm:text-sm hover:underline'>
                    View all posts
                </Link>
            </div>
            <Posts category='all' title='Recent Posts' />
            <Posts category='webtech' title='Web Tech' />
            <Posts category='history' title='History' />
            <Posts category='science' title='Science' />
            <Posts category='science-fiction' title='Science & Fiction' />
            <Posts category='mystery' title='Mystery' />
            <Posts category='facts' title='Facts' />
        </div>
    );
};

export default Home;
