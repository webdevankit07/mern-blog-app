import { Alert } from 'flowbite-react';
import { useForm } from 'react-hook-form';
import { useEffect, useRef, useState } from 'react';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useAppSelector } from '../../store/storeHooks';
import { firebaseStorage } from '../../firebase';
import ProfileForm from './ProfileForm';

export type profileFormData = {
    userName: string;
    email: string;
    password: string;
    profilePicture?: File;
};

const DashProfile = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUrl, setImageFileUrl] = useState<string | null>(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);

    const filePickerRef = useRef<HTMLInputElement | null>(null);

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
                        console.log({ downloadURL });
                        setImageFileUrl(downloadURL);
                        setImageFileUploadingProgress(null);
                    });
                }
            );
        }
    }, [imageFile]);

    // Form Submit....*;
    const handleFormSubmit = (formData: profileFormData) => {
        console.log(formData);
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
                <ProfileForm register={register} currentUser={currentUser} />
            </form>
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
