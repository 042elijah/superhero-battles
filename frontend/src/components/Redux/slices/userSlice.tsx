import { createSlice } from "@reduxjs/toolkit";


// sets value of global token for authentication
export const userSlice = createSlice({
    name: "token",
    initialState: { 
        username: '',
        value: '' // Value is the JWT
    },
    reducers: {
        setValue(state, token) {
            state.value = token.payload;
        },

        setUsername(state, param) {
            state.username = param.payload;
        }
    }
})

export const userActions = userSlice.actions;
export default userSlice.reducer; // The Redux tutorial on React's website had two exports (not sure why though)