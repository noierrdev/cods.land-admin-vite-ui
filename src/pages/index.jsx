import { Button } from "@mui/material"
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux"
import {authSuccess} from '../store/reducers/auth.reducer'
import { useNavigate } from "react-router-dom";
export default (props)=>{
    const dispatch=useDispatch()
    const navigate=useNavigate();
    const authData=useSelector(reducer=>reducer.authReducer.authData);
    useEffect(()=>{
        if(!authData){
            navigate('/auth/signin')
        }else{
            navigate('/admin/products')
        }
    },[authData])
    return (
        <></>
    )
}