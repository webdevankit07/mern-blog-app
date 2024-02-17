import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/storeHooks';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { handleAxiosError } from '../../utils/utils';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [userPosts, setUserPosts] = useState<Post[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [pageNo, setPageNo] = useState<number>(1);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [postId, setPostId] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await axios(
                    `${import.meta.env.VITE_API_BASE_URL}post/getposts?userId=${currentUser?._id}`
                );
                setUserPosts(data.data.posts);
                if (data.data.posts.length < 9) {
                    setShowMore(false);
                } else {
                    setShowMore(true);
                }
                setLoading(false);
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
                setLoading(false);
            }
        };
        setPageNo((prev) => prev + 1);
        fetchPosts();
    }, [currentUser?._id]);

    const handleShowMore = async () => {
        try {
            setPageNo((prev) => prev + 1);
            const { data } = await axios(
                `${import.meta.env.VITE_API_BASE_URL}post/getposts?userId=${currentUser?._id}&page=${pageNo}`
            );
            setUserPosts([...userPosts, ...data.posts]);
            if (data.posts.length < 9) {
                setShowMore(false);
            } else {
                setShowMore(true);
            }
        } catch (error) {
            const err = await handleAxiosError(error);
            console.log(err);
        }
    };

    // Delete Post..
    const handleDeletePost = async () => {
        setShowModal(false);
        try {
            await axios.delete(`${import.meta.env.VITE_API_BASE_URL}post/deletepost/${postId}/${currentUser?._id}`);
            setUserPosts((prev) => prev.filter((post) => post._id !== postId));
        } catch (error) {
            const err = await handleAxiosError(error);
            console.log(err);
        }
    };

    if (loading) {
        return (
            <div className='grid w-full min-h-screen place-content-center'>
                <Spinner size={'xl'} />
            </div>
        );
    }

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
                                        <span
                                            className='font-medium text-red-500 cursor-pointer hover:underline'
                                            onClick={() => {
                                                setShowModal(true);
                                                setPostId(post._id);
                                            }}
                                        >
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
                        <button className='self-center w-full text-sm text-teal-500 py-7' onClick={handleShowMore}>
                            Show more
                        </button>
                    )}
                </>
            ) : (
                <p>You have no posts yet!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this post?
                        </h3>
                        <div className='flex justify-center gap-5'>
                            <Button
                                onClick={() => {
                                    setShowModal(false);
                                }}
                                color='gray'
                                outline
                            >
                                No, cancle
                            </Button>
                            <Button color='failure' onClick={handleDeletePost}>
                                Yes, I'm sure
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashPosts;
