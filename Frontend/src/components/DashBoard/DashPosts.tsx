import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/storeHooks';
import { Table } from 'flowbite-react';
import { Link } from 'react-router-dom';

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

type Post = {
    _id: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    category: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const DashPosts = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [showMore, setShowMore] = useState(true);
    const [pageNo, setPageNo] = useState(1);

    console.log(userPosts);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios(`/api/v1/post/getposts?userId=${currentUser?._id}`);
                setUserPosts(data.posts);
                if (data.posts.length < 9) {
                    setShowMore(false);
                }
            } catch (error) {
                if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                    // dispatch(updateUserFailure(error.response?.data.message));
                    console.log(error.response?.data.message);
                } else {
                    const err = error as Error;
                    // dispatch(updateUserFailure(err.message));
                    console.log(err.message);
                }
            }
        };
        setPageNo((prev) => prev + 1);
        fetchPosts();
    }, [currentUser?._id]);

    const handleShow = async () => {
        try {
            setPageNo((prev) => prev + 1);
            const { data } = await axios(`/api/v1/post/getposts?userId=${currentUser?._id}&page=${pageNo}`);
            setUserPosts([...userPosts, ...data.posts]);
            if (data.posts.length < 9) {
                setShowMore(false);
            }
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                // dispatch(updateUserFailure(error.response?.data.message));
                console.log(error.response?.data.message);
            } else {
                const err = error as Error;
                // dispatch(updateUserFailure(err.message));
                console.log(err.message);
            }
        }
    };

    return (
        <div className='p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser?.isAdmin && userPosts && userPosts.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post title</Table.HeadCell>
                            <Table.HeadCell>category</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                            <Table.HeadCell>Edit</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {userPosts.map((post) => (
                                <Table.Row key={post._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(post.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/post/${post.slug}`}>
                                            <img
                                                src={post.image}
                                                alt={post.title}
                                                className='object-cover w-20 h-10 bg-gray-500'
                                            />
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link
                                            to={`/post/${post.slug}`}
                                            className='font-medium text-gray-900 cursor-pointer dark:text-white'
                                        >
                                            {post.title}
                                        </Link>
                                    </Table.Cell>
                                    <Table.Cell>{post.category}</Table.Cell>
                                    <Table.Cell>
                                        <span className='font-medium text-red-500 cursor-pointer hover:underline'>
                                            Delete
                                        </span>
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Link to={`/update-post/${post._id}`} className='text-teal-500 hover:underline'>
                                            <span>Edit</span>
                                        </Link>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && (
                        <button className='self-center w-full text-sm text-teal-500 py-7' onClick={handleShow}>
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}
        </div>
    );
};

export default DashPosts;
