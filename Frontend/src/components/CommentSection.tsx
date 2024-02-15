import { Link } from 'react-router-dom';
import { useAppSelector } from '../store/storeHooks';
import { Button, Textarea } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { handleAxiosError } from '../utils/utils';
import axios from 'axios';
import ShowAlert from './showAlert';
import Comment from './Comment';

type PropsType = {
    postId: string;
};

export type CommentType = {
    _id: string;
    content: string;
    postId: string;
    userId: string;
    likes: unknown;
    numberOfLikes: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const CommentSection = ({ postId }: PropsType) => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [comment, setComment] = useState<string>('');
    const [commentError, setCommentError] = useState<string | undefined | null>(null);
    const [comments, setComments] = useState<CommentType[] | []>([]);

    //Submit comment....*:
    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try {
            if (comment.length > 200) return;
            const Data = { content: comment, postId, userId: currentUser?._id };
            const { data } = await axios.post(`/api/v1/comment/create`, Data);
            setComment('');
            setCommentError(null);
            setComments([data.data, ...comments]);
            console.log(data.data);
        } catch (error) {
            const err = await handleAxiosError(error);
            setCommentError(err);
        }
    };

    //Get comments.....*:
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios(`/api/v1/comment/getPostComments/${postId}`);
                setComments(data.data);
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        })();
    }, [postId]);

    // handleLike...*:
    const handleLike = async () => {};

    // handleEdit...*:
    const handleEdit = async () => {};

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
            {comments.length === 0 ? (
                <p className='my-5 text-sm'>No comments yet!</p>
            ) : (
                <>
                    <div className='flex items-center gap-1 my-5 text-sm'>
                        <p>Comments</p>
                        <div className='px-2 py-1 border border-gray-400 rounded-sm'>
                            <p>{comments.length}</p>
                        </div>
                    </div>
                    {comments.map((comment) => (
                        <Comment
                            key={comment._id}
                            comment={comment}
                            onLike={handleLike}
                            onEdit={handleEdit}
                            onDelete={(commentId) => {
                                // setShowModal(true);
                                // setCommentToDelete(commentId);
                            }}
                        />
                    ))}
                </>
            )}
        </div>
    );
};

export default CommentSection;
