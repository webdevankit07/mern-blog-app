import { z } from 'zod';

export const createPostSchema = z.object({
    title: z.string({ required_error: 'title is required' }),
    content: z.string({ required_error: 'content is required' }),
    category: z.string(),
});
