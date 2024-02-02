import { createSlice } from '@reduxjs/toolkit';

type InitialState = {
    theme: string;
};

const initialState: InitialState = {
    theme: 'light',
};

const themeSlice = createSlice({
    name: 'theme',
    initialState,
    reducers: {
        toggleTheme: (state: InitialState) => {
            state.theme = state.theme === 'light' ? 'dark' : 'light';
        },
    },
});

export default themeSlice.reducer;
export const { toggleTheme } = themeSlice.actions;
