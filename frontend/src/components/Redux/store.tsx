import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";

// main store
const store = configureStore({
    reducer: {
        token: userSlice.reducer
    }
});

export default store;