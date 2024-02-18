import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import { useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { firebaseStorage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import 'react-circular-progressbar/dist/styles.css';
import ShowAlert from '../components/showAlert';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

type FormData = {
    title?: string;
    content?: string;
    image?: string;
    category?: string;
};

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

const CreatePost = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
    const [formData, setFormData] = useState<FormData | null>(null);
    const [publishError, setPublishError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();

    // Upload the image...
    const handleUploadImage = async () => {
        try {
            if (!imageFile) {
                setImageFileUploadError('Please select an image');
                return;
            }
            const fileName = `${new Date().getTime()}-${Math.round(Math.random() * 10000000000)}-${imageFile.name}`;
            const strorageRef = ref(firebaseStorage, fileName);
            const uploadTask = uploadBytesResumable(strorageRef, imageFile);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress = parseInt(((snapshot.bytesTransferred / snapshot.totalBytes) * 100).toFixed(0));
                    setImageFileUploadingProgress(progress);
                },
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                (_err) => {
                    setImageFileUploadError(`Image upload failed`);
                    setImageFileUploadingProgress(null);
                    setImageFile(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setFormData({ ...formData, image: downloadURL });
                        setImageFileUploadingProgress(null);
                    });
                }
            );
        } catch (error) {
            setImageFileUploadError(`Image upload failed`);
            setImageFileUploadingProgress(null);
            console.log(error);
        }
    };

    //Form Submit....
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            const { data } = await axios.post('/api/v1/post/create', formData);
            navigate(`/post/${data.data.post.slug}`);
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                setPublishError(error.response?.data.message);
            } else {
                const err = error as Error;
                setPublishError(err.message);
            }
        }
    };

    return (
        <div className='max-w-4xl p-3 mx-auto mb-20'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    />
                    <Select onChange={(e) => setFormData({ ...formData, category: e.target.value })}>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <div className='flex flex-col items-center justify-between gap-4 p-3 border-2 border-teal-500 border-dashed md:flex-row'>
                    <FileInput
                        className='w-full md:flex-1'
                        onChange={(e) => setImageFile(e.target.files && e.target.files[0])}
                    />
                    <Button
                        type='button'
                        gradientDuoTone={'purpleToBlue'}
                        size={'sm'}
                        outline
                        onClick={handleUploadImage}
                        disabled={!imageFileUploadingProgress === null}
                        className='w-full md:w-32'
                    >
                        {imageFileUploadingProgress ? 'uploading...' : 'Upload image'}
                    </Button>
                </div>
                {imageFileUploadError && (
                    <ShowAlert
                        message={imageFileUploadError}
                        type='failure'
                        onClose={() => setImageFileUploadError(null)}
                        className={'-m-0 mx-1/2'}
                    />
                )}
                {formData?.image && (
                    <img src={formData.image} alt='upload image' className='object-cover w-full h-72' />
                )}
                <ReactQuill
                    theme='snow'
                    placeholder='Write something...'
                    className='mb-12 h-72'
                    onChange={(value) => {
                        setFormData({ ...formData, content: value });
                    }}
                />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>
                    Publish
                </Button>
            </form>
            {publishError && (
                <ShowAlert
                    message={publishError}
                    type='failure'
                    onClose={() => setPublishError(undefined)}
                    errorDuration={10000}
                />
            )}
        </div>
    );
};

export default CreatePost;
