import { createSlice } from "@reduxjs/toolkit";


// sets value of global token for authentication
export const userSlice = createSlice({
    name: "token",
    initialState: { value: '' },
    reducers: {
        setValue(state, token) {
            state.value = token.payload;
        }
    }
})

export const userActions = userSlice.actions;