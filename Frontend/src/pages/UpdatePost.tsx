import { Button, FileInput, Select, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { firebaseStorage } from '../firebase';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import 'react-circular-progressbar/dist/styles.css';
import ShowAlert from '../components/showAlert';
import { useNavigate, useParams } from 'react-router-dom';
import { handleAxiosError } from '../utils/utils';
import { useAppSelector } from '../store/storeHooks';
import { Axios } from '../config/api';

type FormData = {
    title?: string;
    content?: string;
    image?: string;
    category?: string;
};

const UpdatePost = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    const { postId } = useParams();
    const [loading, setLoading] = useState<boolean>(true);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageFileUploadingProgress, setImageFileUploadingProgress] = useState<number | null>(null);
    const [imageFileUploadError, setImageFileUploadError] = useState<string | null>(null);
    const [publishError, setPublishError] = useState<string | undefined>(undefined);
    const navigate = useNavigate();
    const [formData, setFormData] = useState<FormData>({
        title: '',
        content: '',
        image: '',
        category: '',
    });
    const [formDataContent, setFormDataContent] = useState<string>('');

    // fetchData...
    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await Axios(`/post/getposts?postId=${postId}`);
                setFormData(data.data.posts[0]);
                setPublishError(undefined);
                setLoading(false);
            } catch (error) {
                const err = await handleAxiosError(error);
                setPublishError(err);
                setLoading(false);
            }
        })();
    }, [postId]);

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
                        setImageFileUploadError(null);
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
            const postData = { ...formData, content: formDataContent };
            const { data } = await Axios.put(`/post/updatepost/${postId}/${currentUser?._id}`, postData);
            navigate(`/post/${data.data.slug}`);
        } catch (error) {
            const err = await handleAxiosError(error);
            setPublishError(err);
        }
    };

    if (loading) {
        return (
            <div className='grid min-h-screen place-content-center'>
                <Spinner size={'xl'} />
            </div>
        );
    }

    return (
        <div className='max-w-4xl p-3 mx-auto mb-20'>
            <h1 className='text-3xl font-semibold text-center my-7'>Update a post</h1>
            <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
                <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                    <TextInput
                        type='text'
                        placeholder='Title'
                        required
                        id='title'
                        className='flex-1'
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        value={formData?.title}
                    />
                    <Select
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        value={formData?.category}
                    >
                        <option value='uncategorized'>Select a category</option>
                        <option value='webtech'>WebTech</option>
                        <option value='history'>History</option>
                        <option value='science'>Science</option>
                        <option value='science-fiction'>Science & Fiction</option>
                        <option value='mystery'>Mystery</option>
                        <option value='facts'>Facts</option>
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
                    onChange={(value) => setFormDataContent(value)}
                    value={formDataContent || formData.content}
                />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>
                    Update
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

export default UpdatePost;
