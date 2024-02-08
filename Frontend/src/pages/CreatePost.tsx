import { Button, FileInput, Select, TextInput } from 'flowbite-react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';

const CreatePost = () => {
    return (
        <div className='max-w-4xl p-3 mx-auto mb-20'>
            <h1 className='text-3xl font-semibold text-center my-7'>Create a post</h1>
            <form className='flex flex-col gap-4'>
                <div className='flex flex-col justify-between gap-4 sm:flex-row'>
                    <TextInput type='text' placeholder='Title' required id='title' className='flex-1' />
                    <Select>
                        <option value='uncategorized'>Select a category</option>
                        <option value='javascript'>JavaScript</option>
                        <option value='reactjs'>React.js</option>
                        <option value='nextjs'>Next.js</option>
                    </Select>
                </div>
                <div className='flex items-center justify-between gap-4 p-3 border-2 border-teal-500 border-dashed'>
                    <FileInput className='flex-1' />
                    <Button type='button' gradientDuoTone={'purpleToBlue'} size={'sm'} outline>
                        Upload image
                    </Button>
                </div>
                <ReactQuill theme='snow' placeholder='Write something...' className='mb-12 h-72' />
                <Button type='submit' gradientDuoTone={'purpleToPink'}>
                    Publish
                </Button>
            </form>
        </div>
    );
};

export default CreatePost;
