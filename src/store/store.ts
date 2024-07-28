import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { musicApi } from "./action/actionApi";

const rootReducer = combineReducers({
  [musicApi.reducerPath]: musicApi.reducer,
});

export function setupStore() {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(musicApi.middleware),
  });
}

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
