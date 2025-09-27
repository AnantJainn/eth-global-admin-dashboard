import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    address: null,
  },
  reducers: {
    setWalletAddress: (state, action) => {
      state.address = action.payload;
    },
    disconnectWallet: (state) => {
      state.address = null;
    },
  },
});

export const { setWalletAddress, disconnectWallet } = walletSlice.actions;
export default walletSlice.reducer;
