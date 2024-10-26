import {createSlice} from '@reduxjs/toolkit';
import axios from 'axios';
import toast from 'react-hot-toast'

const initialState = {
    isAdminLoggedIn : false,
    admin:null,
    customers:[]
};

const adminSlice = createSlice({
    name: "admin",
    initialState: initialState,
    reducers:{
        adminLogin: (state, action)=>{
            state.isAdminLoggedIn = true;
            state.admin = action.payload
        },
        adminLogout: (state) => {
            state.isAdminLoggedIn = false;
            state.admin = null;
        },
        setCustomers: (state, action) => {
            state.customers = action.payload
        },
    }
});

export const {adminLogin, adminLogout, setCustomers} = adminSlice.actions;
export default adminSlice.reducer;




 