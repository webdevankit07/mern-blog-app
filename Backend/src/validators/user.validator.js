import { z } from 'zod';

export const updateUserSchema = z.object({
    password: z.string().min(8, { message: 'password must be at least 8 characters' }),
});
