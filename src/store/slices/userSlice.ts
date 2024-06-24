import { createAction, createAsyncThunk, createSlice, PrepareAction } from '@reduxjs/toolkit';
import { persistUser, persistUserInfo, readUser, readUserInfo } from '@app/services/localStorage';
import { GetProfileInfo } from '@app/services/auth';

const initialState: any = {
  user: readUser(),
  userInfo: readUserInfo(),
};

export const setUser = createAction<PrepareAction<any>>('user/setUser', (newUser) => {
  persistUser(newUser);
  return {
    payload: newUser,
  };
});

export const fetchUserInfo = createAsyncThunk('user/fetchUserInfo', async (_, { dispatch }) => {
  const userInfo = await GetProfileInfo();
  persistUserInfo(userInfo.data.result);
  return userInfo.data.result;
});

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(setUser, (state, action) => {
      state.user = action.payload;
    });
    builder.addCase(fetchUserInfo.fulfilled, (state, action) => {
      state.userInfo = action.payload;
    });
  },
});

export default userSlice.reducer;
