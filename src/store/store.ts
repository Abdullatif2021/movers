import { configureStore } from '@reduxjs/toolkit';
import { errorLoggingMiddleware } from '@app/store/middlewares/errorLogging.middleware';
import rootReducer from '@app/store/slices';
import searchReducer from '@app/store/slices/searchSlice';

export const store = configureStore({
  reducer: {
    ...rootReducer,
    search: searchReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(errorLoggingMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
