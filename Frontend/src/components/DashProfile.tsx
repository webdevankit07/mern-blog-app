import { Alert, Button, TextInput } from 'flowbite-react';
import { useAppSelector } from '../store/storeHooks';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { MdModeEdit, MdEditOff, MdEmail } from 'react-icons/md';
import { RiLockPasswordFill } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { firebaseStorage } from '../firebase';

import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

type profileFormData = {
    userName: string;
    email: string;
    password: string;
    profilePicture?: File;
};

const DashProfile = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [isUsernameDisabled, setIsUsernameDisabled] = useState<boolean>(true);
    const [isEmailDisabled, setIsEmailDisabled] = useState<boolean>(true);
    const [isPasswordDisabled, setIsPasswordDisabled] = useState<boolean>(true);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);

    console.log({ imageFileUploadingProgress, imageFileUploadError, imageFileUrl });

    const filePickerRef = useRef<HTMLInputElement | null>(null);

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<profileFormData>();

    // Form Submit....*;
    const handleFormSubmit = (formData: profileFormData) => {
        console.log(formData);
    };

    const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        if (imageFile) {
            setImageFileUploadError(null);
            const fileName = `${new Date().getTime()}-${Math.round(Math.random() * 10000000000)}-${imageFile?.name}`;
            const strorageRef = ref(firebaseStorage, fileName);
            const uploadTask = uploadBytesResumable(strorageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    setImageFileUploadingProgress(
                        parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0))
                    );
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (_err) => {
                    setImageFileUploadError(`could not upload image (File must be less than 2MB)`);
                    setImageFileUploadingProgress(null);
                    setImageFile(null);
                    setImageFileUrl(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log(downloadURL);
                        setImageFileUrl(downloadURL);
                        setImageFileUploadingProgress(null);
                    });
                }
            );
        }
    }, [imageFile]);

    // const uploadImage = async () => {
    //     setImageFileUploadError(null);
    //     const fileName = `${new Date().getTime()}-${Math.round(Math.random() * 10000000000)}-${imageFile?.name}`;
    //     const strorageRef = ref(firebaseStorage, fileName);
    //     if (imageFile) {
    //         const uploadTask = uploadBytesResumable(strorageRef, imageFile);
    //         uploadTask.on(
    //             'state_changed',
    //             (snapshot) => {
    //                 setImageFileUploadingProgress(
    //                     parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0))
    //                 );
    //             },
    //             // eslint-disable-next-line @typescript-eslint/no-unused-vars
    //             (_err) => {
    //                 setImageFileUploadError(`could not upload image (File must be less than 2MB)`);
    //                 setImageFileUploadingProgress(null);
    //                 setImageFile(null);
    //                 setImageFileUrl(null);
    //             },
    //             () => {
    //                 getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
    //                     console.log(downloadURL);
    //                     setImageFileUrl(downloadURL);
    //                     setImageFileUploadingProgress(null);
    //                 });
    //             }
    //         );
    //     }
    // };

    return (
        <div className='w-full max-w-lg p-3 mx-auto mb-20'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit(handleFormSubmit)}>
                <input
                    type='file'
                    accept='image/*'
                    onChange={handleImageChange}
                    ref={filePickerRef}
                    className='hidden'
                />
                <div
                    className='relative self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer'
                    onClick={() => filePickerRef.current?.click()}
                >
                    <img
                        src={imageFileUrl || currentUser?.profilePicutre}
                        alt='user'
                        className={`w-full h-full rounded-full border-4 border-[lightgray] object-cover  ${
                            imageFileUploadingProgress && imageFileUploadingProgress < 100 && 'opacity-60'
                        }`}
                    />
                    {imageFileUploadingProgress && (
                        <CircularProgressbar
                            value={imageFileUploadingProgress || 0}
                            text={`${imageFileUploadingProgress}%`}
                            strokeWidth={5}
                            styles={{
                                root: {
                                    width: '100%',
                                    height: '100%',
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                },
                                path: {
                                    stroke: `rgba(62,152,199, ${imageFileUploadingProgress / 100})`,
                                },
                            }}
                        />
                    )}
                </div>
                {imageFileUploadError && (
                    <Alert className='text-center' color={'failure'}>
                        {imageFileUploadError}
                    </Alert>
                )}
                <div className='flex flex-col gap-4'>
                    <label className='relative' htmlFor='userName'>
                        <TextInput
                            type='text'
                            id='userName'
                            placeholder='username'
                            icon={FaUserCircle}
                            defaultValue={currentUser?.userName}
                            disabled={isUsernameDisabled}
                            {...register('userName', { required: 'username is required' })}
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
                                required: 'email is required',
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
                            defaultValue={'Enter Your Password'}
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
                <div className='flex justify-between px-1 text-red-500'>
                    <Button className='cursor-pointer' color='failure' outline>
                        Delete Account
                    </Button>
                    <Button className='cursor-pointer' gradientDuoTone={'pinkToOrange'} outline>
                        Sign Out
                    </Button>
                </div>
            </form>
            {errors.userName && (
                <Alert className='mt-5 text-center' color={'failure'}>
                    {errors.userName?.message}
                </Alert>
            )}
            {errors.email && (
                <Alert className='mt-5 text-center' color={'failure'}>
                    {errors.email?.message}
                </Alert>
            )}
            {errors.password && (
                <Alert className='mt-5 text-center' color={'failure'}>
                    {errors.password?.message}
                </Alert>
            )}
        </div>
    );
};

export default DashProfile;
