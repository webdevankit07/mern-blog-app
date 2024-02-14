import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/storeHooks';
import { Button, Textarea } from 'flowbite-react';
import { useState } from 'react';
import { handleAxiosError } from '../utils/utils';
import axios from 'axios';
import ShowAlert from './showAlert';

type PropsType = {
    postId: string;
};

const CommentSection = ({ postId }: PropsType) => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [comment, setComment] = useState<string>('');
    const [commentError, setCommentError] = useState<string | undefined | null>(null);

    //Submit comment....*:
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (comment.length > 200) return;
            const Data = { content: comment, postId, userId: currentUser?._id };
            const { data } = await axios.post(`/api/v1/comment/create`, Data);
            setComment('');
            setCommentError(null);
            console.log(data.data);
        } catch (error) {
            const err = await handleAxiosError(error);
            setCommentError(err);
        }
    };

    return (
        <div className='w-full max-w-2xl p-3 mx-auto'>
            {currentUser ? (
                <div className='flex items-center gap-1 my-5 text-sm text-gray-500 '>
                    <p>Signed in as:</p>
                    <img
                        src={currentUser.profilePicture}
                        alt={currentUser.userName}
                        className='object-cover w-5 h-5 rounded-full'
                    />
                    <Link to={'/dashboard?tab=profile'} className='text-xs text-teal-500 hover:underline'>
                        @{currentUser.userName}
                    </Link>
                </div>
            ) : (
                <div className='flex gap-1 my-5 text-sm text-teal-500'>
                    <div>You must be sign in to comment.</div>
                    <Link to={'/sign-in'} className='text-blue-500 hover:underline'>
                        Sign in
                    </Link>
                </div>
            )}
            {currentUser && (
                <form className='p-3 border border-teal-500 rounded-md' onSubmit={handleSubmit}>
                    <Textarea
                        placeholder='Add a comment...'
                        rows={3}
                        maxLength={200}
                        className='resize-none'
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <div className='flex items-center justify-between mt-5'>
                        <p className='text-xs text-gray-500'>{200 - comment.length} characters remaining</p>
                        <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>
                            Submit
                        </Button>
                    </div>
                    {commentError && (
                        <ShowAlert message={commentError} type='failure' errorDuration={5000} className='mt-5' />
                    )}
                </form>
            )}
        </div>
    );
};

export default CommentSection;
