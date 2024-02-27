import { useEffect } from 'react';
import { HiAnnotation, HiArrowNarrowUp, HiDocumentText, HiOutlineUserGroup } from 'react-icons/hi';
import { Button, Spinner, Table } from 'flowbite-react';
import { Link } from 'react-router-dom';
import { useAppSelector } from '../../store/storeHooks';
import { Post } from '../../pages/PostPage';
import { CommentType } from '../CommentSection';
import { UserType } from './DashUsers';
import { handleAxiosError } from '../../utils/utils';
import { Axios } from '../../config/api';
import { useQuery } from '@tanstack/react-query';

const DashBoardComp = () => {
    const { currentUser } = useAppSelector((state) => state.user);

    const { data: usersData, isLoading } = useQuery({
        queryKey: ['users'],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/user/getusers?limit=5`);
                if (currentUser?.isAdmin) {
                    return data.data;
                }
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        },
    });

    const { data: postsData } = useQuery({
        queryKey: ['posts'],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/post/getposts?limit=5`);
                if (currentUser?.isAdmin) {
                    return data.data;
                }
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        },
    });

    const { data: commentsData } = useQuery({
        queryKey: ['comments'],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/comment/getAllComments?limit=5`);
                if (currentUser?.isAdmin) {
                    return data.data;
                }
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        },
    });

    useEffect(() => {
        // setLoading(true);
        if (currentUser?.isAdmin) {
            // (async () => {
            //     try {
            //         const { data } = await Axios(`/user/getusers?limit=5`);
            //         setUsers(data.data.users);
            //         setTotalUsers(data.data.totalUsers);
            //         setLastMonthUsers(data.data.lastMonthUsers);
            //     } catch (error) {
            //         const err = await handleAxiosError(error);
            //         console.log(err);
            //     }
            // })();
            // (async () => {
            //     try {
            //         const { data } = await Axios(`/post/getposts?limit=5`);
            //         setPosts(data.data.posts);
            //         setTotalPosts(data.data.totalPosts);
            //         setLastMonthPosts(data.data.lastMonthPosts);
            //     } catch (error) {
            //         const err = await handleAxiosError(error);
            //         console.log(err);
            //     }
            // })();
            // (async () => {
            //     try {
            //         const { data } = await Axios(`/comment/getAllComments?limit=5`);
            //         setComments(data.data.comments);
            //         setTotalComments(data.data.totalComments);
            //         setLastMonthComments(data.data.lastMonthComments);
            //     } catch (error) {
            //         const err = await handleAxiosError(error);
            //         console.log(err);
            //     }
            // })();
            // setLoading(false);
        }
    }, [currentUser]);

    if (isLoading) {
        return (
            <div className='grid w-full min-h-screen place-content-center'>
                <Spinner size={'xl'} />
            </div>
        );
    }

    return (
        <div className='max-w-6xl p-3 md:mx-auto'>
            <div className='flex flex-wrap justify-center gap-4'>
                <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 uppercase text-md'>Total Users</h3>
                            <p className='text-2xl'>{usersData?.totalUsers}</p>
                        </div>
                        <HiOutlineUserGroup className='p-3 text-5xl text-white bg-teal-600 rounded-full shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span
                            className={`flex items-center ${
                                usersData?.lastMonthUsers ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {usersData?.lastMonthUsers > 0 && <HiArrowNarrowUp />}
                            {usersData?.lastMonthUsers}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 uppercase text-md'>Total Comments</h3>
                            <p className='text-2xl'>{commentsData?.totalComments}</p>
                        </div>
                        <HiAnnotation className='p-3 text-5xl text-white bg-indigo-600 rounded-full shadow-lg' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span
                            className={`flex items-center ${
                                commentsData?.lastMonthComments ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {commentsData?.lastMonthComments > 0 && <HiArrowNarrowUp />}
                            {commentsData?.lastMonthComments}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
                <div className='flex flex-col w-full gap-4 p-3 rounded-md shadow-md dark:bg-slate-800 md:w-72'>
                    <div className='flex justify-between'>
                        <div className=''>
                            <h3 className='text-gray-500 uppercase text-md'>Total Posts</h3>
                            <p className='text-2xl'>{postsData?.totalPosts}</p>
                        </div>
                        <HiDocumentText className='p-3 text-5xl text-white rounded-full shadow-lg bg-lime-600' />
                    </div>
                    <div className='flex gap-2 text-sm'>
                        <span
                            className={`flex items-center ${
                                postsData?.lastMonthPosts ? 'text-green-500' : 'text-red-500'
                            }`}
                        >
                            {postsData?.lastMonthPosts > 0 && <HiArrowNarrowUp />}
                            {postsData?.lastMonthPosts}
                        </span>
                        <div className='text-gray-500'>Last month</div>
                    </div>
                </div>
            </div>
            <div className='flex flex-wrap justify-center gap-4 py-3 mx-auto [&>*]:min-w-[400px] [&>*]:max-w-[800px]'>
                <div className='flex flex-col flex-1 w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='p-2 text-center'>Recent users</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=users'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                        </Table.Head>
                        {usersData &&
                            usersData.users.map((user: UserType) => (
                                <Table.Body key={user._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell>
                                            <img
                                                src={user.profilePicture}
                                                alt='user'
                                                className='w-10 h-10 bg-gray-500 rounded-full'
                                            />
                                        </Table.Cell>
                                        <Table.Cell>{user.userName}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className='flex flex-col flex-1 w-full p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='p-2 text-center'>Recent comments</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=comments'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Likes</Table.HeadCell>
                        </Table.Head>
                        {commentsData &&
                            commentsData.comments.map((comment: CommentType) => (
                                <Table.Body key={comment._id} className='divide-y'>
                                    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                        <Table.Cell className='w-96'>
                                            <p className='line-clamp-2'>{comment.content}</p>
                                        </Table.Cell>
                                        <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            ))}
                    </Table>
                </div>
                <div className='flex flex-col flex-wrap flex-1 p-2 rounded-md shadow-md md:w-auto dark:bg-gray-800'>
                    <div className='flex justify-between p-3 text-sm font-semibold'>
                        <h1 className='p-2 text-center'>Recent posts</h1>
                        <Button outline gradientDuoTone='purpleToPink'>
                            <Link to={'/dashboard?tab=posts'}>See all</Link>
                        </Button>
                    </div>
                    <Table hoverable>
                        <Table.Head className='[&>*]:text-center'>
                            <Table.HeadCell>Post image</Table.HeadCell>
                            <Table.HeadCell>Post Title</Table.HeadCell>
                            <Table.HeadCell>Category</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {postsData &&
                                postsData.posts.map((post: Post) => (
                                    <Table.Row
                                        key={post._id}
                                        className=' bg-white dark:border-gray-700 dark:bg-gray-800 [&>*]:text-center'
                                    >
                                        <Table.Cell className='flex justify-center'>
                                            <Link to={`/post/${post.slug}`}>
                                                <img
                                                    src={post.image}
                                                    alt='user'
                                                    className='h-10 bg-gray-500 rounded-md w-14'
                                                />
                                            </Link>
                                        </Table.Cell>
                                        <Table.Cell className='w-96'>
                                            <Link to={`/post/${post.slug}`}>{post.title}</Link>
                                        </Table.Cell>
                                        <Table.Cell className='w-5'>{post.category}</Table.Cell>
                                    </Table.Row>
                                ))}
                        </Table.Body>
                    </Table>
                </div>
            </div>
        </div>
    );
};

export default DashBoardComp;
