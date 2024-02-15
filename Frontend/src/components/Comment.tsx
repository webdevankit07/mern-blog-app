import { useEffect, useState } from 'react';
import { CommentType } from './CommentSection';
import { handleAxiosError } from '../utils/utils';
import axios from 'axios';
import moment from 'moment';
// import { Button, Textarea } from 'flowbite-react';
import { useAppSelector } from '../store/storeHooks';
import { FaThumbsUp } from 'react-icons/fa';

type PropsType = {
    comment: CommentType;
    onLike: (commentId: string) => void;
    onEdit: () => void;
    onDelete: (commentId: string) => void;
};

type User = {
    _id: string;
    fullName: string;
    userName: string;
    profilePicture: string;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

const Comment = ({ comment, onLike, onEdit, onDelete }: PropsType) => {
    const { currentUser } = useAppSelector((state) => state.user);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios(`/api/v1/user/getuser/${comment.userId}`);
                setUser(data.data);
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
            }
        })();
    }, [comment]);
    return (
        <div className='flex p-4 text-sm border-b dark:border-gray-600'>
            <div className='flex-shrink-0 mr-3'>
                <img className='w-10 h-10 bg-gray-200 rounded-full' src={user?.profilePicture} alt={user?.userName} />
            </div>
            <div className='flex-1'>
                <div className='flex items-center mb-1'>
                    <span className='mr-1 text-xs font-bold truncate'>
                        {user ? `@${user.userName}` : 'anonymous user'}
                    </span>
                    <span className='text-xs text-gray-500'>{moment(comment.createdAt).fromNow()}</span>
                </div>
                {/* //.................. */}
                <p className='pb-2 text-gray-500'>{comment.content}</p>
                <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
                    <button
                        type='button'
                        onClick={() => onLike(comment._id)}
                        className={`text-gray-400 hover:text-blue-500 ${
                            currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                        }`}
                    >
                        <FaThumbsUp className='text-sm' />
                    </button>
                    <p className='text-gray-400'>
                        {comment.numberOfLikes > 0 &&
                            comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                    </p>
                </div>
                {/* {isEditing ? (
                    <>
                        <Textarea
                            className='mb-2'
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                        />
                        <div className='flex justify-end gap-2 text-xs'>
                            <Button type='button' size='sm' gradientDuoTone='purpleToBlue' onClick={handleSave}>
                                Save
                            </Button>
                            <Button
                                type='button'
                                size='sm'
                                gradientDuoTone='purpleToBlue'
                                outline
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </>
                ) : (
                    <>
                        <p className='pb-2 text-gray-500'>{comment.content}</p>
                        <div className='flex items-center gap-2 pt-2 text-xs border-t dark:border-gray-700 max-w-fit'>
                            <button
                                type='button'
                                onClick={() => onLike(comment._id)}
                                className={`text-gray-400 hover:text-blue-500 ${
                                    currentUser && comment.likes.includes(currentUser._id) && '!text-blue-500'
                                }`}
                            >
                                <FaThumbsUp className='text-sm' />
                            </button>
                            <p className='text-gray-400'>
                                {comment.numberOfLikes > 0 &&
                                    comment.numberOfLikes + ' ' + (comment.numberOfLikes === 1 ? 'like' : 'likes')}
                            </p>
                            {currentUser && (currentUser._id === comment.userId || currentUser.isAdmin) && (
                                <>
                                    <button
                                        type='button'
                                        onClick={handleEdit}
                                        className='text-gray-400 hover:text-blue-500'
                                    >
                                        Edit
                                    </button>
                                    <button
                                        type='button'
                                        onClick={() => onDelete(comment._id)}
                                        className='text-gray-400 hover:text-red-500'
                                    >
                                        Delete
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )} */}
            </div>
        </div>
    );
};

export default Comment;
