import { z } from 'zod';

export const createCommentSchema = z.object({
    content: z.string({ required_error: 'content is required' }),
    postId: z.string({ required_error: 'postId is required' }),
    userId: z.string({ required_error: 'userId is required' }),
});
