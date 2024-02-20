const About = () => {
    return (
        <div className='flex justify-center flex-1 my-32'>
            <div className='max-w-2xl p-3 mx-auto text-center'>
                <div>
                    <h1 className='text-3xl font-semibold text-center font my-7'>About Web Universe</h1>
                    <div className='flex flex-col gap-6 text-gray-500 text-md'>
                        <p>
                            Welcome to Web Universe! This blog was created by Ankit Yadav as a personal project to share
                            his thoughts and ideas with the world. Ankit is a passionate developer who loves to write
                            bizare facts about world.
                        </p>

                        <p>
                            On this blog, you'll find weekly articles and tutorials on Intresting topics. Ankit is
                            always learning and exploring new things, so be sure to check back often for new content!
                        </p>

                        <p>
                            We encourage you to leave comments on our posts and engage with other readers. You can like
                            other people's comments and reply to them as well. We believe that a community of learners
                            can help each other grow and improve.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default About;
