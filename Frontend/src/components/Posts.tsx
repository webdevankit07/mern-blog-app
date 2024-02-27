import { Post } from '../pages/PostPage';
import { Axios } from '../config/api';
import { handleAxiosError } from '../utils/utils';
import PostCard from './PostCard';
import { Link } from 'react-router-dom';
import 'react-loading-skeleton/dist/skeleton.css';

// swiper...*:
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import PostCardSkeleton from './PostCardSkeleton';

type PropsType = {
    category: string;
    title: string;
};

const Posts = ({ category, title }: PropsType) => {
    const { isLoading, data: posts } = useQuery({
        queryKey: [category],
        queryFn: async () => {
            try {
                const { data } = await Axios(`/post/getallposts?category=${category}`);
                return data.data.posts.reverse().slice(0, 9);
            } catch (error) {
                const err = await handleAxiosError(error);
                console.log(err);
                return err;
            }
        },
        placeholderData: keepPreviousData,
    });

    return (
        <>
            <div className='flex flex-col max-w-6xl gap-8 p-1 mx-auto'>
                {isLoading ? (
                    <div className='flex flex-col gap-6 '>
                        <div className='flex items-center justify-between px-3'>
                            <h2 className='text-2xl font-semibold'>
                                {title}
                                <hr className='w-full mt-2' />
                            </h2>
                            <Link to={'/search'} className='text-lg text-center text-teal-500 hover:underline'>
                                View all posts
                            </Link>
                        </div>
                        <PostCardSkeleton cards={3} />
                    </div>
                ) : (
                    posts &&
                    posts.length > 0 && (
                        <div className='flex flex-col gap-6 '>
                            <div className='flex items-center justify-between px-3'>
                                <h2 className='text-2xl font-semibold'>
                                    {title}
                                    <hr className='w-full mt-2' />
                                </h2>
                                <Link to={'/search'} className='text-lg text-center text-teal-500 hover:underline'>
                                    View all posts
                                </Link>
                            </div>
                            <div className='flex flex-wrap justify-between gap-4'>
                                <Swiper
                                    slidesPerView={1}
                                    spaceBetween={30}
                                    pagination={{
                                        clickable: true,
                                    }}
                                    breakpoints={{
                                        640: {
                                            slidesPerView: 1,
                                            spaceBetween: 20,
                                        },
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 40,
                                        },
                                        1024: {
                                            slidesPerView: 3,
                                            spaceBetween: 50,
                                        },
                                    }}
                                    modules={[Pagination, Navigation]}
                                    navigation={true}
                                    className='mySwiper h-[420px]'
                                >
                                    {posts.map((post: Post) => (
                                        <SwiperSlide key={post._id}>
                                            <PostCard key={post._id} post={post} />
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            </div>
                        </div>
                    )
                )}
            </div>
        </>
    );
};

export default Posts;
