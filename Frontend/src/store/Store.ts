import { configureStore } from '@reduxjs/toolkit';
import userSlice from './features/user/userSlice';

const store = configureStore({
    reducer: {
        user: userSlice,
    },
});

export default store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
