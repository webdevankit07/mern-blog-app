import { PayloadAction, createSlice } from '@reduxjs/toolkit';

export type currentUser = {
    _id: string;
    fullName: string;
    userName: string;
    email: string;
    profilePicture: string;
    createdAt: string;
    updatedAt: string;
    isAdmin: boolean;
    __v: number;
};

type InitialState = {
    currentUser: currentUser | null;
    loading: boolean;
    error: string | null | undefined;
};

const initialState: InitialState = {
    currentUser: null,
    loading: false,
    error: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUserState: (state: InitialState, { payload }: PayloadAction<currentUser | null>) => {
            state.currentUser = payload;
            state.loading = false;
            state.error = null;
        },
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
        deleteUserStart: (state: InitialState) => {
            state.loading = true;
            state.error = null;
        },
        deleteUserSuccess: (state: InitialState) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure: (state: InitialState, { payload }: PayloadAction<string | undefined>) => {
            state.loading = false;
            state.error = payload;
        },
        signoutUserSuccess: (state: InitialState) => {
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
    },
});

export default userSlice.reducer;
export const {
    setUserState,
    setUserError,
    signInStart,
    signInSuccess,
    signInFailure,
    updateUserStart,
    updateUserSuccess,
    updateUserFailure,
    deleteUserStart,
    deleteUserSuccess,
    deleteUserFailure,
    signoutUserSuccess,
} = userSlice.actions;
