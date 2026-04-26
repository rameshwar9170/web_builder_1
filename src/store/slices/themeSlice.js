import { createSlice } from '@reduxjs/toolkit';

const themeSlice = createSlice({
  name: 'theme',
  initialState: {
    currentTheme: 'default',
    customColors: {
      primary: '#0ea5e9',
      secondary: '#0369a1'
    },
    fontFamily: 'Inter',
    layout: 'modern'
  },
  reducers: {
    setTheme: (state, action) => {
      state.currentTheme = action.payload;
    },
    setCustomColors: (state, action) => {
      state.customColors = action.payload;
    },
    setFontFamily: (state, action) => {
      state.fontFamily = action.payload;
    },
    setLayout: (state, action) => {
      state.layout = action.payload;
    }
  }
});

export const { setTheme, setCustomColors, setFontFamily, setLayout } = themeSlice.actions;
export default themeSlice.reducer;
