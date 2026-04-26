import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { adminService } from '../../services/adminService';

export const fetchAllAdmins = createAsyncThunk(
  'admin/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      return await adminService.getAllAdmins();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createAdmin = createAsyncThunk(
  'admin/create',
  async ({ adminData, superAdminId }, { rejectWithValue }) => {
    try {
      return await adminService.createAdmin(adminData, superAdminId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    admins: [],
    loading: false,
    error: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllAdmins.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllAdmins.fulfilled, (state, action) => {
        state.loading = false;
        state.admins = action.payload;
      })
      .addCase(fetchAllAdmins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
