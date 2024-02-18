import { Alert } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAppDispatch, useAppSelector } from '../../store/storeHooks';
import { firebaseStorage } from '../../firebase';
import ProfileForm from './ProfileForm';
import axios from 'axios';
import {
    setUserError,
    updateUserFailure,
    updateUserStart,
    updateUserSuccess,
} from '../../store/features/user/userSlice';
import ShowAlert from '../showAlert';

export type profileFormData = {
    userName: string | null;
    email: string | null;
    password: string | null;
};

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

const DashProfile = () => {
    const { currentUser, error, loading } = useAppSelector((state) => state.user);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
    const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
    const filePickerRef = useRef<HTMLInputElement | null>(null);
    const dispatch = useAppDispatch();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<profileFormData>();

    const handleImageChange = (e: React.FormEvent<HTMLInputElement>) => {
        const target = e.target as HTMLInputElement;
        const file: File = (target.files as FileList)[0];
        if (file) {
            setImageFile(file);
            setImageFileUrl(URL.createObjectURL(file));
        }
    };

    useEffect(() => {
        dispatch(setUserError(null));
    }, [dispatch]);

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
                        setUploadedImageUrl(downloadURL);
                    });
                }
            );
        }
    }, [imageFile]);

    // Form Submit....*;
    const handleFormSubmit = async (data: profileFormData) => {
        const { userName, email, password } = data;

        if (imageFileUploadingProgress && imageFileUploadingProgress > 0 && imageFileUploadingProgress < 100) {
            return dispatch(setUserError('Please wait while image uploading...'));
        }

        if (
            (userName === undefined || userName === currentUser?.userName) &&
            (email === undefined || email === currentUser?.email) &&
            password === undefined &&
            uploadedImageUrl === null
        ) {
            return dispatch(setUserError('No changes made in profile'));
        }

        const profilePicture = uploadedImageUrl || undefined;
        const formData = {
            userName,
            email,
            password,
            profilePicture,
        };

        setUpdateSuccess(null);
        dispatch(updateUserStart());
        try {
            if (Object.keys(formData).length === 0 || (!userName && !email && !password && !profilePicture)) {
                return dispatch(setUserError('No changes made in profile'));
            }

            const { data } = await axios.put(`/api/v1/user/update/${currentUser?._id}`, formData);
            dispatch(updateUserSuccess(data.data.updatedUser));
            setImageFileUploadingProgress(null);
            setUpdateSuccess('user updated successfully.');
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                dispatch(updateUserFailure(error.response?.data.message));
            } else {
                const err = error as Error;
                dispatch(updateUserFailure(err.message));
            }
        }
    };

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
                        src={imageFileUrl || currentUser?.profilePicture}
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

                {/* //!  Profile form */}
                <ProfileForm register={register} currentUser={currentUser} loading={loading} />
            </form>
            {updateSuccess && (
                <ShowAlert message={updateSuccess} type='success' onClose={() => setUpdateSuccess(null)} />
            )}
            {errors.email && <ShowAlert message={errors.email?.message} type='failure' />}
            {errors.password && <ShowAlert message={errors.password?.message} type='failure' />}
            {error && <ShowAlert message={error} type='failure' onClose={() => dispatch(setUserError(null))} />}
        </div>
    );
};

export default DashProfile;
