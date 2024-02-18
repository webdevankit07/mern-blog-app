import axios from 'axios';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { signInFailure, signInStart, signInSuccess } from '../store/features/user/userSlice';

// React Icons...
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '../store/storeHooks';
import OAuth from '../components/OAuth';
import { Axios } from '../config/api';

type SignInFormData = {
    fullName: string;
    userName: string;
    email: string;
    password: string;
    confirmPassword: string;
};

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

const Signin = () => {
    const { loading, error } = useAppSelector((state) => state.user);
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<SignInFormData>();

    //Form Submit.....*;
    const handleFormSubmit = async (formData: SignInFormData) => {
        try {
            dispatch(signInStart());
            const { data } = await Axios.post(`/auth/login`, formData);
            dispatch(signInSuccess(data.data.user));
            navigate('/');
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                dispatch(signInFailure(error.response?.data.message));
            } else {
                const err = error as Error;
                dispatch(signInFailure(err.message));
            }
        }
    };

    return (
        <div className='my-20'>
            <div className='flex flex-col max-w-5xl p-3 mx-auto md:flex-row md:items-center'>
                {/* Left */}
                <div className='flex-1'>
                    <Link to={'/'} className='text-4xl font-bold sm:text-xl dark:text-white'>
                        <span className='px-2 py-1 mr-0.5 text-white rounded-lg bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'>
                            Ankit's
                        </span>
                        Blog
                    </Link>
                    <p className='mt-5 text-sm'>
                        Lorem ipsum dolor sit amet, consectetur adipisicing elit. Magni sint velit a!
                    </p>
                </div>

                {/* Right */}
                <div className='flex-1'>
                    <form className='flex flex-col gap-4' onSubmit={handleSubmit(handleFormSubmit)}>
                        <div>
                            <Label value='Your email' htmlFor='email' />
                            <TextInput
                                type='email'
                                placeholder='name@company.com'
                                id='email'
                                autoComplete='off'
                                {...register('email', {
                                    required: 'email is required',
                                    pattern: {
                                        value: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/,
                                        message: 'Invalid Email Id',
                                    },
                                    validate: {
                                        blockDomain: (value) => {
                                            return !value.endsWith('test.com') || 'This is not a valid domain';
                                        },
                                        lengthError: (value) => {
                                            return value.length > 6 || 'please enter a valid email address';
                                        },
                                    },
                                })}
                            />
                            <p className='h-2 px-3 pt-1 pb-3 text-sm text-red-500'>{errors.email?.message}</p>
                        </div>
                        <div>
                            <Label value='Your password' htmlFor='password' />
                            <TextInput
                                type={isPasswordVisible ? 'text' : 'password'}
                                placeholder='**********'
                                id='password'
                                autoComplete='off'
                                rightIcon={isPasswordVisible ? BsFillEyeFill : BsFillEyeSlashFill}
                                onClick={() => setIsPasswordVisible((prev) => !prev)}
                                {...register('password', {
                                    required: 'password is required',
                                    validate: {
                                        lengthError: (value) => {
                                            return value.length >= 8 || 'password must be atleast 8 characters';
                                        },
                                    },
                                })}
                            />
                            <p className='h-2 px-3 pt-1 pb-3 text-sm text-red-500'>{errors.password?.message}</p>
                        </div>
                        <Button gradientDuoTone={'purpleToPink'} type='submit' disabled={loading}>
                            {loading ? (
                                <>
                                    <Spinner size={'sm'} />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </Button>
                        <OAuth />
                    </form>
                    <div className='flex gap-1 mt-5 text-sm'>
                        <span>Don't have an account yet?</span>
                        <Link to={'/sign-up'} className='text-blue-600 underline'>
                            Sign Up
                        </Link>
                    </div>
                    {error && (
                        <Alert className='mt-5 text-center' color={'failure'}>
                            {error}
                        </Alert>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Signin;
