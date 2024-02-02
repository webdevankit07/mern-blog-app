import axios from 'axios';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

// React Icons...
import { BsFillEyeFill, BsFillEyeSlashFill } from 'react-icons/bs';

type SignUpFormData = {
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

const Signup = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | undefined>();
    const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
    const navigate = useNavigate();
    const {
        register,
        formState: { errors, isSubmitSuccessful },
        handleSubmit,
        reset,
        watch,
    } = useForm<SignUpFormData>();

    // Form reset.....*;
    useEffect(() => {
        if (isSubmitSuccessful) {
            reset();
        }
    }, [isSubmitSuccessful, reset]);

    //Form Submit.....*;
    const handleFormSubmit = async (formData: SignUpFormData) => {
        setIsLoading(true);
        try {
            // setError(undefined);
            await axios.post('/api/v1/auth/register', formData);
            setIsLoading(false);
            navigate('/sign-in');
        } catch (error) {
            if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
                setError(error.response?.data.message);
            } else {
                const err = error as Error;
                setError(err.message);
            }
            setIsLoading(false);
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
                            <Label value='Your fullName' htmlFor='fullname' />
                            <TextInput
                                type='text'
                                placeholder='Your name'
                                id='fullname'
                                autoComplete='off'
                                {...register('fullName', {
                                    required: 'fullname is required',
                                })}
                            />
                            <p className='h-2 px-3 pt-1 pb-3 text-sm text-red-500'>{errors.fullName?.message}</p>
                        </div>
                        <div>
                            <Label value='Your userName' htmlFor='username' />
                            <TextInput
                                type='text'
                                placeholder='Username'
                                id='username'
                                autoComplete='off'
                                {...register('userName', {
                                    required: 'username is required',
                                })}
                            />
                            <p className='h-2 px-3 pt-1 pb-3 text-sm text-red-500'>{errors.userName?.message}</p>
                        </div>
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
                                placeholder='Password'
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
                        <div>
                            <Label value='Confirm your password' htmlFor='confirmPassword' />
                            <TextInput
                                type='password'
                                placeholder='confirmPassword'
                                id='confirmPassword'
                                autoComplete='off'
                                {...register('confirmPassword', {
                                    required: { value: true, message: 'Please confirm the password' },
                                    validate: (value) => {
                                        return watch('password') === value || 'your password does not match';
                                    },
                                })}
                            />
                            <p className='h-2 px-3 pt-1 pb-3 text-sm text-red-500'>{errors.confirmPassword?.message}</p>
                        </div>
                        <Button gradientDuoTone={'purpleToPink'} type='submit' disabled={isLoading}>
                            {isLoading ? (
                                <>
                                    <Spinner size={'sm'} />
                                    <span className='pl-3'>Loading...</span>
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </Button>
                    </form>
                    <div className='flex gap-1 mt-5 text-sm'>
                        <span>Have an account?</span>
                        <Link to={'/sign-in'} className='text-blue-600 underline'>
                            Sign In
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

export default Signup;
