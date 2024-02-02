import { useAppSelector } from '../store/storeHooks';

type LayoutProps = {
    children: React.ReactNode;
};

const ThemeProvider = ({ children }: LayoutProps) => {
    const { theme } = useAppSelector((state) => state.theme);

    return (
        <div className={theme}>
            <div className='text-gray-800 bg-white dark:text-gray-200 dark:bg-[rgb(16,23,42)]'>{children}</div>
        </div>
    );
};

export default ThemeProvider;
