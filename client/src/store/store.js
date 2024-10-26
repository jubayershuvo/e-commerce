import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from 'redux-persist';
import storage from "redux-persist/lib/storage";
import {thunk} from "redux-thunk"; // Import thunk correctly
import authSlice from "./authSlice";
import adminSlice from "./adminSlice";
import usersSlice from "./usersSlice";

// Configure persist
const persistConfig = {
    key: 'root',
    storage,
};
const rootReducer = (state, action) => {
    if (action.type === 'auth/logout') {
        state = undefined;
    }
    return combineReducers({
        auth: authSlice,
        adminAuth: adminSlice,
        Users: usersSlice,
    })(state, action);
};
// Combine reducers and persist
const persistedReducer = persistReducer(
    persistConfig,
    rootReducer, 
    combineReducers({
        auth: authSlice,
        adminAuth: adminSlice,
        Users: usersSlice,
    })
);

// Configure store with thunk middleware
const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) => 
        getDefaultMiddleware({
            serializableCheck: false, // Disables the serializable check if needed for non-serializable data
        }).concat(thunk), // Adding thunk explicitly, though it's added by default
});

// Configure persistor
const persistor = persistStore(store);

export { store, persistor };