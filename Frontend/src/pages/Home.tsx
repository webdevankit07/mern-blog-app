import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import PostCard from '../components/PostCard';
import axios from 'axios';
import { Post } from './PostPage';
import { handleAxiosError } from '../utils/utils';
import { Spinner } from 'flowbite-react';
import { useAppSelector } from '../store/storeHooks';

const Home = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState<boolean>(true);
    const [posts, setPosts] = useState<Post[] | []>([]);

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await axios(`${import.meta.env.VITE_API_BASE_URL}post/getposts`);
                setPosts(data.data.posts);
                setLoading(false);
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
                setLoading(false);
            }
        })();
    }, []);

    return (
        <div>
            <div className='flex flex-col max-w-6xl gap-6 px-3 mx-auto p-28 '>
                <h1 className='text-3xl font-bold lg:text-6xl'>
                    Welcome {currentUser?.userName === 'webdevankit07' ? 'to my Blog' : currentUser?.fullName}
                </h1>
                <p className='text-xs text-gray-500 sm:text-sm'>
                    Here you'll find a variety of articles and tutorials on topics such as web development, software
                    engineering, and programming languages.
                </p>
                <Link to='/search' className='text-xs font-bold text-teal-500 sm:text-sm hover:underline'>
                    View all posts
                </Link>
            </div>

            <div className='flex flex-col max-w-6xl gap-8 p-3 mx-auto py-7'>
                {loading ? (
                    <div className='grid place-content-center'>
                        <Spinner size={'xl'} />
                    </div>
                ) : (
                    posts &&
                    posts.length > 0 && (
                        <div className='flex flex-col gap-6 '>
                            <h2 className='text-2xl font-semibold text-center'>
                                Recent Posts
                                <span className='flex justify-center'>
                                    <hr className='w-40 mt-2' />
                                </span>
                            </h2>
                            <div className='flex flex-wrap justify-center gap-4'>
                                {posts.map((post) => (
                                    <PostCard key={post._id} post={post} />
                                ))}
                            </div>
                            <Link to={'/search'} className='text-lg text-center text-teal-500 hover:underline'>
                                View all posts
                            </Link>
                        </div>
                    )
                )}
            </div>
        </div>
    );
};

export default Home;
