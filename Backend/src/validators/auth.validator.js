import { z } from 'zod';

// create an object schema....
const signupSchema = z.object({
    fullName: z
        .string({ required_error: 'fullName is required' })
        .trim()
        .min(3, { message: 'Name must be at least 3 characters' })
        .max(100, { message: 'Name must be at most 100 characters' }),
    userName: z
        .string({ required_error: 'userName is required' })
        .trim()
        .min(3, { message: 'userName must be at least 3 characters' })
        .max(30, { message: 'userName must be at most 100 characters' }),
    email: z
        .string({ required_error: 'email is required' })
        .trim()
        .email({ message: 'Invalid email address' })
        .min(3, { message: 'email must be at least 3 characters' })
        .max(100, { message: 'email must be at most 100 characters' }),
    password: z
        .string({ required_error: 'password is required' })
        .min(8, { message: 'password must be at least 8 characters' })
        .max(100, { message: 'password must be at most 100 characters' }),
});

const loginSchema = z.object({
    email: z.string({ required_error: 'email is required' }).trim().email({ message: 'Invalid email address' }),
    password: z.string({ required_error: 'password is required' }),
});

const googleSchema = z.object({
    name: z.string(),
    email: z.string({ required_error: 'email is required' }).trim().email({ message: 'Invalid email address' }),
    googlePhotoUrl: z.string(),
});

export { signupSchema, loginSchema, googleSchema };
