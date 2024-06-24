import { createSlice } from '@reduxjs/toolkit';

const searchSlice = createSlice({
  name: 'search',
  initialState: '',
  reducers: {
    setSearchString: (state, action) => {
      return action.payload;
    },
    resetSearch: (state) => {
      return '';
    },
  },
});

export const { setSearchString, resetSearch } = searchSlice.actions;
export default searchSlice.reducer;
