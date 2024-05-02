import React from "react";
import { useNavigate } from "react-router-dom";
import {useSelector} from 'react-redux'
import axios from "axios";
import { BACKEND_URL } from "../AppConfigs";

const useAuth=async ()=>{
    // const authData=useSelector(reducer=>reducer.authReducer.authData);
    // if(!authData) return document.location="/";
    // const token=sessionStorage.getItem('token');
    // if(!token) return document.location="/";
    
}
export default useAuth;