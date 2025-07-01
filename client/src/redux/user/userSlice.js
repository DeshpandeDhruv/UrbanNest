import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
  error: null,
  loading: false,
};

const userSlice=createSlice({
    name:'user',
    initialState,
    reducers:{
        signInStart: (state) => {
            state.loading = true;
          },
          signInSuccess: (state, action) => {
            state.currentUser = action.payload;
            state.loading = false;
            state.error = null;
          },
          signInFailure: (state, action) => {
            state.error = action.payload;
            state.loading = false;
          },
          signOut: (state) => {
          state.currentUser = null;
          state.error = null;
          state.loading = false;
          },

          updateUserStart: (state) => {
          state.loading = true;
          state.error = null;
          },

          logout: (state) => {
         state.currentUser = null;
         state.loading = false;
          state.error = null;
           },

          updateUserSuccess: (state, action) => {
         state.loading = false;
         state.currentUser = action.payload;
         },
          updateUserFailure: (state, action) => {
        state.loading = false;
         state.error = action.payload;
},
    },
});
export const {signInFailure,signOut,logout,signInStart,signInSuccess,updateUserStart,updateUserSuccess,updateUserFailure} =userSlice.actions;


export default userSlice.reducer;