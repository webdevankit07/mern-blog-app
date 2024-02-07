import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { firebaseApp } from '../firebase';
import axios from 'axios';
import { useAppDispatch } from '../store/storeHooks';
import { signInSuccess } from '../store/features/user/userSlice';
import { useNavigate } from 'react-router-dom';

const OAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const auth = getAuth(firebaseApp);
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });

        try {
            const resultsFromGoogle = await signInWithPopup(auth, googleProvider);
            const googleData = {
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            };

            const { data } = await axios.post('/api/v1/auth/google', googleData);
            console.log(data.data.user);
            dispatch(signInSuccess(data.data.user));
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Button type='button' gradientDuoTone={'pinkToOrange'} outline onClick={handleGoogleClick}>
            <AiFillGoogleCircle className='w-6 h-6 mr-2' />
            Continue with Google
        </Button>
    );
};

export default OAuth;
