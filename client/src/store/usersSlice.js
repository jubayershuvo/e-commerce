import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isCartOpen: false,
  cartList: [],
  currency: "BDT",
  payableAmount: 0,
  discountCupon: 0,
  discount: 0,
  discountedCuponPrice: 0,
};

const usersSlice = createSlice({
  name: "control_user",
  initialState: initialState,
  reducers: {
    setCartOpen: (state) => {
      state.isCartOpen = true;
    },
    setCartClose: (state) => {
      state.isCartOpen = false;
    },
    setCartList: (state, action) => {
      state.cartList = action.payload;
    },
    setCurrency: (state, action) => {
      state.currency = action.payload;
    },
    setPayableAmount: (state, action) => {
      state.payableAmount = action.payload;
    },
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    setDiscountCupon: (state, action) => {
      state.discountCupon = action.payload;
    },
    setDiscountedCuponPrice: (state, action) => {
      state.discountedCuponPrice = action.payload;
    },
    clearAll: (state) => {
      state.cartList = [];
      state.discount = 0;
      state.payableAmount = 0;
      state.discountCupon = 0;
      state.discountedCuponPrice = 0;
    },
  },
});

export const {
  setCartOpen,
  setCartClose,
  setCartList,
  setCurrency,
  setPayableAmount,
  setDiscountCupon,
  setDiscount,
  setDiscountedCuponPrice,
  clearAll
} = usersSlice.actions;
export default usersSlice.reducer;
