import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/storeHooks';
import { Button, Modal, Spinner, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { handleAxiosError } from '../../utils/utils';
import { CommentType } from '../CommentSection';
import { Axios } from '../../config/api';

const DashComments = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [loading, setLoading] = useState<boolean>(true);
    const [showMoreLoading, setShowMoreLoading] = useState<boolean>(false);
    const [comments, setComments] = useState<CommentType[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [commentIdToDelete, setCommentIdToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const { data } = await Axios(`/comment/getAllComments`);
                setComments(data.data.comments);
                if (data.data.comments.length < 9) {
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
        fetchPosts();
    }, [currentUser?._id]);

    const handleShowMore = async () => {
        setShowMoreLoading(true);
        const startIndex = comments.length;
        try {
            const { data } = await Axios(`/comment/getAllComments?startIndex=${startIndex}`);
            setComments([...comments, ...data.data.comments]);
            if (data.data.comments.length < 9) {
                setShowMore(false);
            } else {
                setShowMore(true);
            }
            setShowMoreLoading(false);
        } catch (error) {
            const err = await handleAxiosError(error);
            console.log(err);
            setShowMoreLoading(false);
        }
    };

    // Delete User..
    const handleDeleteComment = async () => {
        setShowModal(false);
        try {
            await Axios.delete(`/comment/delete-comment/${commentIdToDelete}`);
            setComments((prev) => prev.filter((comment) => comment._id !== commentIdToDelete));
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
            {currentUser?.isAdmin && comments?.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head className='[&>*]:text-center'>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>Comment content</Table.HeadCell>
                            <Table.HeadCell>Number of likes</Table.HeadCell>
                            <Table.HeadCell>PostId</Table.HeadCell>
                            <Table.HeadCell>UserId</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {comments.map((comment) => (
                                <Table.Row
                                    key={comment._id}
                                    className='bg-white dark:border-gray-700 dark:bg-gray-800 [&>*]:text-center'
                                >
                                    <Table.Cell>{new Date(comment.updatedAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>{comment.content}</Table.Cell>
                                    <Table.Cell>{comment.numberOfLikes}</Table.Cell>
                                    <Table.Cell>{comment.postId}</Table.Cell>
                                    <Table.Cell>{comment.userId}</Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className='font-medium text-red-500 cursor-pointer hover:underline'
                                            onClick={() => {
                                                setShowModal(true);
                                                setCommentIdToDelete(comment._id);
                                            }}
                                        >
                                            Delete
                                        </span>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table>
                    {showMore && !showMoreLoading && (
                        <button className='self-center w-full text-sm text-teal-500 py-7' onClick={handleShowMore}>
                            Show more
                        </button>
                    )}
                    {showMoreLoading && (
                        <div className='grid w-full min-h-20 place-content-center'>
                            <Spinner size={'xl'} />
                        </div>
                    )}
                </>
            ) : (
                <p>You have no comments yet!</p>
            )}
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete this user?
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
                            <Button color='failure' onClick={handleDeleteComment}>
                                Yes, I'm sure
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashComments;
