import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth';
import { Button } from 'flowbite-react';
import { AiFillGoogleCircle } from 'react-icons/ai';
import { firebaseApp } from '../firebase';
import { useAppDispatch } from '../store/storeHooks';
import { signInFailure, signInStart, signInSuccess } from '../store/features/user/userSlice';
import { useNavigate } from 'react-router-dom';
import { handleAxiosError } from '../utils/utils';
import { Axios } from '../config/api';

const OAuth = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const handleGoogleClick = async () => {
        const auth = getAuth(firebaseApp);
        const googleProvider = new GoogleAuthProvider();
        googleProvider.setCustomParameters({ prompt: 'select_account' });

        dispatch(signInStart());
        try {
            const resultsFromGoogle = await signInWithPopup(auth, googleProvider);
            const googleData = {
                name: resultsFromGoogle.user.displayName,
                email: resultsFromGoogle.user.email,
                googlePhotoUrl: resultsFromGoogle.user.photoURL,
            };

            const { data } = await Axios.post(`/auth/google`, googleData);
            dispatch(signInSuccess(data.data.user));
            navigate('/');
        } catch (error) {
            const err = await handleAxiosError(error);
            dispatch(signInFailure(err));
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
