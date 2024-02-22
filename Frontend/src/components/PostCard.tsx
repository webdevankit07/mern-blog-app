import { Link } from 'react-router-dom';
import { Post } from '../pages/PostPage';
import { Button } from 'flowbite-react';

type PropsType = {
    post: Post;
};

const PostCard = ({ post }: PropsType) => {
    return (
        <div className='group relative w-full border border-teal-500 hover:border-2 h-[370px] overflow-hidden rounded-lg sm:w-[360px] transition-all'>
            <Link to={`/post/${post.slug}`}>
                <img
                    src={post.image}
                    alt='post cover'
                    className='h-[220px] w-full  object-cover group-hover:h-[200px] transition-all duration-300 z-20'
                />
            </Link>
            <div className='flex flex-col gap-2 p-3'>
                <p className='text-base font-semibold line-clamp-2'>{post.title}</p>
                <span className='text-sm italic'>
                    <Link to={`/search?category=${post.category}`}>
                        <Button color='gray' size={'xs'} pill>
                            {post.category}
                        </Button>
                    </Link>
                </span>

                <Link
                    to={`/post/${post.slug}`}
                    className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center py-2 rounded-md  m-2'
                >
                    Read article
                </Link>
            </div>
        </div>
    );
};

export default PostCard;
