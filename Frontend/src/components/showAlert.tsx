import { Alert } from 'flowbite-react';
import { useEffect } from 'react';

type alertProps = {
    message: string | undefined;
    type: 'success' | 'failure';
    onClose?: () => void;
};

const ShowAlert = ({ message, type, onClose }: alertProps) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            if (onClose) {
                onClose();
            }
        }, 5000);

        return () => {
            clearTimeout(timer);
        };
    }, [onClose]);

    return (
        <Alert className='mt-5 text-center' color={type}>
            {message}
        </Alert>
    );
};

export default ShowAlert;
