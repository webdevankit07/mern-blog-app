import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type currentUser = {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    profilePicutre: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
};

type InitialState = {
    currentUser: currentUser | null;
    error: string | null | undefined;
    loading: boolean;
};

const initialState: InitialState = {
    currentUser: null,
    error: null,
    loading: false,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        signInStart: (state: InitialState) => {
            state.loading = true;
            state.error = null;
        },
        signInSuccess: (state: InitialState, { payload }: PayloadAction<currentUser>) => {
            state.currentUser = payload;
            state.loading = false;
            state.error = null;
        },
        signInFailure: (state: InitialState, { payload }: PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = payload;
        },
    },
});

export default userSlice.reducer;
export const { signInStart, signInSuccess, signInFailure } = userSlice.actions;
