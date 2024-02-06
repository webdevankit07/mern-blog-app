import { Button, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdEditOff, MdEmail, MdModeEdit } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { UseFormRegister } from 'react-hook-form';
import { profileFormData } from './DashProfile';
import { currentUser } from '../../store/features/user/userSlice';

type PropsType = {
    register: UseFormRegister<profileFormData>;
    currentUser: currentUser | null;
};

const ProfileForm = ({ register, currentUser }: PropsType) => {
    const [isUsernameDisabled, setIsUsernameDisabled] = useState<boolean>(true);
    const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
    const [isPasswordDisabled, setIsPasswordDisabled] = useState<boolean>(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);

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

                <Button type='submit' gradientDuoTone={'purpleToBlue'} outline className='w-full'>
                    Update
                </Button>
            </div>
            <div className='flex justify-between mt-4 text-red-500'>
                <Button className='cursor-pointer' color='failure' outline>
                    Delete Account
                </Button>
                <Button className='cursor-pointer' gradientDuoTone={'pinkToOrange'} outline>
                    Sign Out
                </Button>
            </div>
        </div>
    );
};

export default ProfileForm;
