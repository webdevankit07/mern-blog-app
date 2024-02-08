import { Alert } from 'flowbite-react';
import { useEffect } from 'react';

type alertProps = {
    message: string | undefined;
    type: 'success' | 'failure';
    className?: string;
    onClose?: () => void;
    errorDuration?: number;
};

const ShowAlert = ({ message, type, onClose, className, errorDuration }: alertProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, errorDuration || 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose, errorDuration]);

    return (
        <Alert className={`mt-5 text-center ${className}`} color={type}>
            {message}
        </Alert>
    );
};

export default ShowAlert;
