import axios from 'axios';

interface ValidationError {
    message: string;
    errors: Record<string, string[]>;
}

export const handleAxiosError = async (error: unknown) => {
    if (axios.isAxiosError<ValidationError, Record<string, unknown>>(error)) {
        return error.response?.data.message;
    } else {
        const err = error as Error;
        return err.message;
    }
};
