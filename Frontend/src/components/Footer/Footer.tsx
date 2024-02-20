import { Footer } from 'flowbite-react';
import { BsFacebook, BsGithub, BsInstagram, BsLinkedin, BsTwitter } from 'react-icons/bs';
import { Link } from 'react-router-dom';

const FooterCom = () => {
    return (
        <Footer container className='border border-t-4 border-teal-500'>
            <div className='w-full mx-auto max-w-7xl'>
                <div className='flex flex-col justify-between md:flex-row md:px-14'>
                    <div className='mb-5 md:mb-0'>
                        <Link
                            to={'/'}
                            className='self-center text-lg font-semibold whitespace-nowrap sm:text-xl dark:text-white'
                        >
                            <div className='w-[150px] md:w-[200px]'>
                                <img
                                    src='../../../public/web-universe-high-resolution-logo-transparent.png'
                                    alt='logo'
                                />
                            </div>
                        </Link>
                    </div>
                    <div className='grid grid-cols-2 gap-8 sm:mt-4 sm:grid-cols-3 sm:gap-10'>
                        <div>
                            <Footer.Title title='About' />
                            <Footer.LinkGroup col>
                                <Link to={'/'}>Ankit's Blog</Link>
                                <Link to={'/about'}>About</Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='FoLLOW US' />
                            <Footer.LinkGroup col>
                                <Footer.Link
                                    href='https://github.com/webdevankit07'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Github
                                </Footer.Link>
                                <Footer.Link
                                    href='https://www.linkedin.com/in/webdevankit/'
                                    target='_blank'
                                    rel='noopener noreferrer'
                                >
                                    Linkdln
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                        <div>
                            <Footer.Title title='LGEAL' />
                            <Footer.LinkGroup col>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Privacy Policy
                                </Footer.Link>
                                <Footer.Link href='#' target='_blank' rel='noopener noreferrer'>
                                    Terms & Conditions
                                </Footer.Link>
                            </Footer.LinkGroup>
                        </div>
                    </div>
                </div>
                <Footer.Divider />
                <div className='w-full sm:flex sm:items-center sm:justify-between sm:px-5'>
                    <Footer.Copyright
                        href='https://github.com/webdevankit07'
                        by='WebDev Ankit'
                        year={new Date().getFullYear()}
                    />
                    <div className='flex gap-6 mt-4 md:mt-2 md:justify-center'>
                        <Footer.Icon href='https://www.linkedin.com/in/webdevankit/' icon={BsLinkedin} />
                        <Footer.Icon href='https://github.com/webdevankit07' icon={BsGithub} />
                        <Footer.Icon href='#' icon={BsInstagram} />
                        <Footer.Icon href='#' icon={BsFacebook} />
                        <Footer.Icon href='#' icon={BsTwitter} />
                    </div>
                </div>
            </div>
        </Footer>
    );
};

export default FooterCom;
