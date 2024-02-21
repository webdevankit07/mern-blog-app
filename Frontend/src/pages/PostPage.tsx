import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { handleAxiosError } from '../utils/utils';
import { Button, Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { Axios } from '../config/api';

export type Post = {
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
    const [articleLoading, setArticleLoading] = useState<boolean>(true);
    const [post, setPost] = useState<Post | null>(null);
    const [recentPosts, setRecentPosts] = useState<Post[] | null>(null);
    const { postSlug } = useParams();

    useEffect(() => {
        (async () => {
            setLoading(true);
            try {
                const { data } = await Axios(`/api/v1/post/getposts?slug=${postSlug}`);
                setPost(data.data.posts[0]);
                setLoading(false);
            } catch (error) {
                const err = await handleAxiosError(error);
                setLoading(false);
                console.log(err);
            }
        })();
    }, [postSlug]);

    useEffect(() => {
        (async () => {
            setArticleLoading(true);
            try {
                const { data } = await Axios(`/api/v1/post/getposts`);
                const posts = data.data.posts;
                const filterPosts = posts.reverse().slice(0, 3);
                setRecentPosts(filterPosts);
                setArticleLoading(false);
            } catch (error) {
                const err = handleAxiosError(error);
                console.log(err);
                setArticleLoading(false);
            }
        })();
    }, [post]);

    if (loading) {
        return (
            <div className='grid min-h-screen place-content-center'>
                <Spinner size={'xl'} />
            </div>
        );
    }
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
                    className='w-full max-w-3xl p-3 mx-auto xl:max-w-4xl post-content'
                ></div>
                <div>
                    <CommentSection postId={post._id} />
                </div>
                <div className='flex flex-col items-center justify-center mb-5'>
                    <h1 className='flex flex-col items-center pb-1 mt-5 text-xl'>
                        Recent Articles <hr className='w-[170px] mx-auto mt-2' />
                    </h1>
                    {articleLoading ? (
                        <div className='grid min-h-28 place-content-center'>
                            <Spinner size={'xl'} />
                        </div>
                    ) : (
                        <div className='flex flex-wrap justify-center gap-5 mt-5'>
                            {recentPosts && recentPosts.map((post) => <PostCard key={post._id} post={post} />)}
                        </div>
                    )}
                </div>
            </main>
        )
    );
};

export default PostPage;
