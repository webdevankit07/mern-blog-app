import { Button, TextInput } from 'flowbite-react';
import { useAppSelector } from '../store/storeHooks';

const DashProfile = () => {
    const { currentUser } = useAppSelector((state) => state.user);
    return (
        <div className='w-full max-w-lg p-3 mx-auto'>
            <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
            <form className='flex flex-col gap-4'>
                <div className='self-center w-32 h-32 overflow-hidden rounded-full shadow-md cursor-pointer'>
                    <img
                        src={currentUser?.profilePicutre}
                        alt='user'
                        className='w-full h-full rounded-full border-4 border-[lightgray] object-cover'
                    />
                </div>
                <div className='flex flex-col gap-4'>
                    <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser?.userName} />
                    <TextInput type='email' id='email' placeholder='email' defaultValue={currentUser?.email} />
                    <TextInput type='text' id='password' placeholder='**********' />
                    <Button type='submit' gradientDuoTone={'purpleToBlue'} outline>
                        Update
                    </Button>
                </div>
                <div className='flex justify-between px-1 text-red-500'>
                    <span className='cursor-pointer'>Delete Account</span>
                    <span className='cursor-pointer'>Sign Out</span>
                </div>
            </form>
        </div>
    );
};

export default DashProfile;
