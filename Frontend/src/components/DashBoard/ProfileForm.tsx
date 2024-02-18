import { Button, Modal, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdEditOff, MdEmail, MdModeEdit } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { UseFormRegister } from 'react-hook-form';
import { profileFormData } from './DashProfile';
import {
    currentUser,
    deleteUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    signoutUserSuccess,
} from '../../store/features/user/userSlice';
import { HiOutlineExclamationCircle } from 'react-icons/hi';
import { useAppDispatch } from '../../store/storeHooks';
import { Link } from 'react-router-dom';
import { handleAxiosError } from '../../utils/utils';
import { Axios } from '../../config/api';

type PropsType = {
    register: UseFormRegister<profileFormData>;
    currentUser: currentUser | null;
    loading: boolean;
};

const ProfileForm = ({ register, currentUser, loading }: PropsType) => {
    const [isUsernameDisabled, setIsUsernameDisabled] = useState<boolean>(true);
    const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
    const [isPasswordDisabled, setIsPasswordDisabled] = useState<boolean>(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [showModal, setShowModal] = useState<boolean>(false);
    const dispatch = useAppDispatch();

    // Delete User....*:
    const handleDeleteUser = async () => {
        setShowModal(false);
        dispatch(deleteUserStart());
        try {
            await Axios.delete(`/user/delete/${currentUser?._id}`);
            dispatch(deleteUserSuccess());
        } catch (error) {
            const err = await handleAxiosError(error);
            dispatch(deleteUserFailure(err));
        }
    };

    // SignOut User....*:
    const handleSignout = async () => {
        setShowModal(false);
        try {
            await Axios.post(`/user/logout/${currentUser?._id}`);
            dispatch(signoutUserSuccess());
        } catch (error) {
            const err = await handleAxiosError(error);
            dispatch(deleteUserFailure(err));
        }
    };

    return (
        <div>
            <div className='flex flex-col gap-4'>
                <label className='relative' htmlFor='userName'>
                    <TextInput
                        type='text'
                        id='userName'
                        placeholder='username'
                        icon={FaUserCircle}
                        defaultValue={currentUser?.userName}
                        disabled={isUsernameDisabled}
                        {...register('userName')}
                    />
                    <span
                        className='absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white'
                        onClick={() => setIsUsernameDisabled((prev) => !prev)}
                    >
                        {isUsernameDisabled ? <MdModeEdit /> : <MdEditOff />}
                    </span>
                </label>
                <label className='relative' htmlFor='email'>
                    <TextInput
                        type='email'
                        id='email'
                        placeholder='email'
                        icon={MdEmail}
                        defaultValue={currentUser?.email}
                        disabled={isEmailDisabled}
                        {...register('email', {
                            pattern: {
                                value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                message: 'Invalid Email Id',
                            },
                        })}
                    />
                    <span
                        className='absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white'
                        onClick={() => setIsEmailDisabled((prev) => !prev)}
                    >
                        {isEmailDisabled ? <MdModeEdit /> : <MdEditOff />}
                    </span>
                </label>

                <label className='relative' htmlFor='password'>
                    <TextInput
                        type={isPasswordVisible ? 'text' : 'password'}
                        id='password'
                        disabled={isPasswordDisabled}
                        icon={RiLockPasswordFill}
                        placeholder='*************'
                        {...register('password', {
                            validate: {
                                lengthError: (value) => {
                                    if (!isPasswordDisabled && value) {
                                        return value.length >= 8 || 'password must be atleast 8 characters';
                                    }
                                },
                            },
                        })}
                    />
                    <span
                        className='absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-10 top-2 hover:bg-blue-900 hover:text-white'
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                    >
                        {isPasswordVisible ? <BsFillEyeFill /> : <BsFillEyeSlashFill />}
                    </span>
                    <span
                        className='absolute p-1.5 transition-all duration-200 ease-in-out rounded-full cursor-pointer right-3 top-2 hover:bg-blue-900 hover:text-white'
                        onClick={() => setIsPasswordDisabled((prev) => !prev)}
                    >
                        {isPasswordDisabled ? <MdModeEdit /> : <MdEditOff />}
                    </span>
                </label>

                <Button type='submit' disabled={loading} gradientDuoTone={'purpleToBlue'} outline className='w-full'>
                    {loading ? 'Loading...' : 'Update'}
                </Button>
                {currentUser && currentUser.isAdmin && (
                    <Link to={'/create-post'}>
                        <Button gradientDuoTone={'purpleToPink'} className='w-full'>
                            Create Post
                        </Button>
                    </Link>
                )}
            </div>
            <div className='flex justify-between mt-4 text-red-500'>
                <Button className='cursor-pointer' color='failure' outline onClick={() => setShowModal(true)}>
                    Delete Account
                </Button>
                <Button className='cursor-pointer' gradientDuoTone={'pinkToOrange'} outline onClick={handleSignout}>
                    Sign Out
                </Button>
            </div>
            <Modal show={showModal} onClose={() => setShowModal(false)} popup size={'md'}>
                <Modal.Header />
                <Modal.Body>
                    <div className='text-center'>
                        <HiOutlineExclamationCircle className='mx-auto mb-4 text-gray-400 h-14 w-14 dark:text-gray-200' />
                        <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>
                            Are you sure you want to delete your account?
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

export default ProfileForm;
