import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type currentUser = {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    profilePicture: string;
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
        setUserError: (state: InitialState, { payload }: PayloadAction<string | null>) => {
            state.error = payload;
        },
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
        updateUserStart: (state: InitialState) => {
            state.loading = true;
            state.error = null;
        },
        updateUserSuccess: (state: InitialState, { payload }: PayloadAction<currentUser>) => {
            state.currentUser = payload;
            state.loading = false;
            state.error = null;
        },
        updateUserFailure: (state: InitialState, { payload }: PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = payload;
        },
    },
});

export default userSlice.reducer;
export const {
    setUserError,
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
} = userSlice.actions;
