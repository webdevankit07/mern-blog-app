import axios from 'axios';
import { useEffect, useState } from 'react';
import { useAppSelector } from '../../store/storeHooks';
import { Button, Modal, Table } from 'flowbite-react';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { handleAxiosError } from '../../utils/utils';
import { FaCheck } from 'react-icons/fa6';
import { FaTimes } from 'react-icons/fa';

type Users = {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    profilePicture: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const DashUsers = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [users, setUsers] = useState<Users[]>([]);
    const [showMore, setShowMore] = useState<boolean>(true);
    const [showModal, setShowModal] = useState<boolean>(false);
    const [userIdToDelete, setUserIdToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const { data } = await axios(`/api/v1/user/getusers`);
                setUsers(data.data.users);
                if (data.data.users.length < 9) {
                    setShowMore(false);
                } else {
                    setShowMore(true);
                }
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        };
        fetchPosts();
    }, [currentUser?._id]);

    const handleShowMore = async () => {
        const startIndex = users.length;
        try {
            const { data } = await axios(`/api/v1/user/getusers?startIndex=${startIndex}`);
            setUsers([...users, ...data.data.users]);
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
    const handleDeleteUser = async () => {
        setShowModal(false);
        try {
            await axios.delete(`/api/v1/user/delete/${userIdToDelete}`);
            setUsers((prev) => prev.filter((user) => user._id !== userIdToDelete));
        } catch (error) {
            const err = await handleAxiosError(error);
            console.log(err);
        }
    };

    return (
        <div className='p-3 overflow-x-scroll table-auto md:mx-auto scrollbar scrollbar-track-slate-100 scrollbar-thumb-slate-300 dark:scrollbar-track-slate-700 dark:scrollbar-thumb-slate-500'>
            {currentUser?.isAdmin && users && users.length > 0 ? (
                <>
                    <Table hoverable className='shadow-md'>
                        <Table.Head>
                            <Table.HeadCell>Date updated</Table.HeadCell>
                            <Table.HeadCell>User image</Table.HeadCell>
                            <Table.HeadCell>Username</Table.HeadCell>
                            <Table.HeadCell>Email</Table.HeadCell>
                            <Table.HeadCell>Admin</Table.HeadCell>
                            <Table.HeadCell>Delete</Table.HeadCell>
                        </Table.Head>
                        <Table.Body className='divide-y'>
                            {users.map((user) => (
                                <Table.Row key={user._id} className='bg-white dark:border-gray-700 dark:bg-gray-800'>
                                    <Table.Cell>{new Date(user.createdAt).toLocaleDateString()}</Table.Cell>
                                    <Table.Cell>
                                        <img
                                            src={user.profilePicture}
                                            alt={user.userName}
                                            className='object-cover w-10 h-10 bg-gray-500 rounded-full'
                                        />
                                    </Table.Cell>
                                    <Table.Cell>{user.userName}</Table.Cell>
                                    <Table.Cell>{user.email}</Table.Cell>
                                    <Table.Cell>
                                        {user.isAdmin ? (
                                            <FaCheck className='text-green-400' />
                                        ) : (
                                            <FaTimes className='text-red-500' />
                                        )}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <span
                                            className='font-medium text-red-500 cursor-pointer hover:underline'
                                            onClick={() => {
                                                setShowModal(true);
                                                setUserIdToDelete(user._id);
                                            }}
                                        >
                                            Delete
                                        </span>
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
                <p>You have no users yet!</p>
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
                            <Button color='failure' onClick={handleDeleteUser}>
                                Yes, I'm sure
                            </Button>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </div>
    );
};

export default DashUsers;
