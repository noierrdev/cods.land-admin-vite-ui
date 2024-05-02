import {createSlice} from '@reduxjs/toolkit'

export const authSlice=createSlice({
    name:"auth",
    initialState:{
        authData:null
    },
    reducers:{
        authSuccess:(state,action)=>{
            state.authData=action.payload
        },
        signout:(state)=>{
            sessionStorage.removeItem('token');
            state.authData=null
        }
    }
})

export const {authSuccess, signout  } = authSlice.actions

export default authSlice.reducer