import { createSlice } from "@reduxjs/toolkit";

export const userSlice = createSlice({
    name: 'user',
    initialState: {
        username: '',
        jwt: ''
    },
    reducers: {
        setUsername(state, param) {
            state.username = param.payload;
        },

        setJwt(state, param) {
            state.jwt = param.payload;
            console.log(param);
        }
    }
});

export const userActions = userSlice.actions;
export default userSlice.reducer;