import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage"; 

import signupReducer from "./slices/signUpSlice";
import otpReducer from "./slices/otpSlice";
import loginUser from "./slices/loginSlice";
import profileReducer from "./slices/profileSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/BoardSlice";
import membersReducer from "./slices/memberSlice";
import chatsReducer from "./slices/ChatSlice";
import requestReducer from "./slices/RequestsSlice";
import diagramReducer from "./slices/diagramSlice";
import apiReducer from './slices/apiSlice'

// Combine all reducers
const rootReducer = combineReducers({
  signup: signupReducer,
  otp: otpReducer,
  login: loginUser,
  profile: profileReducer,
  project: projectReducer,
  tasks: taskReducer,
  members: membersReducer,
  chats: chatsReducer,
  request: requestReducer,
  diagram: diagramReducer,
  api:apiReducer,
});

// Redux Persist configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login", "profile", "project"], 
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

// Create persistor
export const persistor = persistStore(store);


// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
  