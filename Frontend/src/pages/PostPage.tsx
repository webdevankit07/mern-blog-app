import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { handleAxiosError } from '../utils/utils';
import axios from 'axios';
import { Button, Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';

type Post = {
    _id: string;
    userId: string;
    title: string;
    slug: string;
    content: string;
    image: string;
    category: string;
    createdAt: Date;
    updatedAt: Date;
    __v: number;
};

const PostPage = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<boolean>(false);
    const [post, setPost] = useState<Post | null>(null);
    const { postSlug } = useParams();

    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios(`/api/v1/post/getposts?slug=${postSlug}`);
                setPost(data.posts[0]);
                setLoading(false);
            } catch (error) {
                const err = handleAxiosError(error);
                setError(true);
                setLoading(false);
                console.log(err);
            }
        })();
    }, [postSlug]);

    if (loading)
        return (
            <div className='grid min-h-screen place-content-center'>
                <Spinner size={'xl'} />
            </div>
        );
    return (
        post && (
            <main className='flex flex-col max-w-6xl min-h-screen p-3 mx-auto'>
                <h1 className='max-w-2xl p-3 mx-auto mt-10 font-serif text-3xl text-center lg:text-4xl'>
                    {post.title}
                </h1>
                <Link to={`/search?category=${post?.category}`} className='self-center mt-5'>
                    <Button color='gray' size={'xs'} pill>
                        {post.category}
                    </Button>
                </Link>
                <img src={post.image} alt={post.slug} className='mt-10 p-3 max-h-[600px] w-full object-cover' />
                <div className='flex justify-between w-full max-w-2xl p-3 mx-auto text-xs border-b border-slate-500'>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                    <span className='italic'>{(post.content.length / 1000).toFixed(0)} mins read</span>
                </div>
                <div
                    dangerouslySetInnerHTML={{ __html: post.content }}
                    className='w-full max-w-2xl p-3 mx-auto post-content'
                ></div>
                <div>
                    <CommentSection postId={post._id} />
                </div>
            </main>
        )
    );
};

export default PostPage;
