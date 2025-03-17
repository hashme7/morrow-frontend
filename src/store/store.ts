import {
  configureStore,
  combineReducers,
} from "@reduxjs/toolkit";
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
import loginReducer from "./slices/loginSlice";
import profileReducer from "./slices/profileSlice";
import projectReducer from "./slices/projectSlice";
import taskReducer from "./slices/BoardSlice";
import membersReducer from "./slices/memberSlice";
import chatsReducer from "./slices/ChatSlice";
import requestReducer from "./slices/RequestsSlice";
import diagramReducer from "./slices/diagramSlice";
import apiReducer from "./slices/apiSlice";

// Combine all reducers
const appReducer = combineReducers({
  signup: signupReducer,
  otp: otpReducer,
  login: loginReducer,
  profile: profileReducer,
  project: projectReducer,
  tasks: taskReducer,
  members: membersReducer,
  chats: chatsReducer,
  request: requestReducer,
  diagram: diagramReducer,
  api: apiReducer,
});

// Root reducer with logout reset
const rootReducer = (state: any, action: any) => {
  if (action.type === "auth/logout/fulfilled") {
    storage.removeItem("persist:root"); // Clear persisted storage
    state = undefined; // Reset Redux store
  }
  return appReducer(state, action);
};

// Redux Persist Configuration
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["login", "profile", "project"], // Persist these slices
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

export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
