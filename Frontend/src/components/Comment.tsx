import { useEffect, useState } from 'react';
import { CommentType } from './CommentSection';
import { handleAxiosError } from '../utils/utils';
import axios from 'axios';
import moment from 'moment';
import { Button, Textarea } from 'flowbite-react';
import { useAppSelector } from '../store/storeHooks';

type PropsType = {
    comment: CommentType;
    onLike: () => void;
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
            </div>
        </div>
    );
};

export default Comment;
