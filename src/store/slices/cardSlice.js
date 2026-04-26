import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { cardService } from '../../services/cardService';

export const fetchAdminCards = createAsyncThunk(
  'card/fetchAdminCards',
  async (adminId, { rejectWithValue }) => {
    try {
      return await cardService.getAdminCards(adminId);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const createCard = createAsyncThunk(
  'card/create',
  async ({ adminId, cardData }, { rejectWithValue }) => {
    try {
      const cardId = await cardService.createCard(adminId, cardData);
      return cardId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const updateCard = createAsyncThunk(
  'card/update',
  async ({ cardId, updates }, { rejectWithValue }) => {
    try {
      await cardService.updateCard(cardId, updates);
      return { cardId, updates };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const cardSlice = createSlice({
  name: 'card',
  initialState: {
    cards: [],
    currentCard: null,
    loading: false,
    error: null
  },
  reducers: {
    setCurrentCard: (state, action) => {
      state.currentCard = action.payload;
    },
    clearCurrentCard: (state) => {
      state.currentCard = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAdminCards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAdminCards.fulfilled, (state, action) => {
        state.loading = false;
        state.cards = action.payload;
      })
      .addCase(fetchAdminCards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createCard.fulfilled, (state, action) => {
        state.loading = false;
      })
      .addCase(updateCard.fulfilled, (state, action) => {
        const index = state.cards.findIndex(c => c.id === action.payload.cardId);
        if (index !== -1) {
          state.cards[index] = { ...state.cards[index], ...action.payload.updates };
        }
      });
  }
});

export const { setCurrentCard, clearCurrentCard, clearError } = cardSlice.actions;
export default cardSlice.reducer;
