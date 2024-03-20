import { configureStore } from "@reduxjs/toolkit";
import { userSlice } from "./slices/userSlice";
import { requestedBattleSlice } from "./slices/requestedBattleSlice";

// main store
const store = configureStore({
    reducer: {
        token: userSlice.reducer,
        requestedBattle: requestedBattleSlice.reducer
    }
});

export default store;