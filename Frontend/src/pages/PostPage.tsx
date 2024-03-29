import { Link, useParams } from 'react-router-dom';
import { handleAxiosError } from '../utils/utils';
import { Button, Spinner } from 'flowbite-react';
import CommentSection from '../components/CommentSection';
import PostCard from '../components/PostCard';
import { Axios } from '../config/api';
import { keepPreviousData, useQuery } from '@tanstack/react-query';

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
    const { postSlug } = useParams();

    const { isLoading, data: post } = useQuery({
        queryKey: [postSlug],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/post/getposts?slug=${postSlug}`);
                return data.data.posts[0];
            } catch (error) {
                const err = handleAxiosError(error);
                console.log(err);
            }
        },
    });

    const { data: recentPosts } = useQuery({
        queryKey: ['recentPosts'],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/post/getallposts`);
                const posts = data.data.posts.reverse().slice(0, 3);
                return posts;
            } catch (error) {
                const err = handleAxiosError(error);
                console.log(err);
            }
        },
        placeholderData: keepPreviousData,
    });
    6;

    if (isLoading) {
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

                    <div className='flex flex-wrap justify-center gap-5 mt-5'>
                        {recentPosts &&
                            recentPosts.map((recentpost: Post) => <PostCard key={recentpost._id} post={recentpost} />)}
                    </div>
                </div>
            </main>
        )
    );
};

export default PostPage;
