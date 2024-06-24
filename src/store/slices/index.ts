import themeReducer from '@app/store/slices/themeSlice';
import userReducer from '@app/store/slices/userSlice';
import authReducer from '@app/store/slices/authSlice';

export default {
  auth: authReducer,
  theme: themeReducer,
  user: userReducer,
};
