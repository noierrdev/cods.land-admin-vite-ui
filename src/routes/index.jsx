import React from 'react'
import {useNavigate, useRoutes, matchRoutes} from 'react-router-dom'
import Loadable from './Loadable';
import axios from 'axios'
import { BACKEND_URL } from '../AppConfigs';
import {useSelector,useDispatch} from 'react-redux'
import {authSuccess} from '../store/reducers/auth.reducer'
const AppRoutes = (props)=>{
    const dispatch=useDispatch()
    const navigate=useNavigate()
    const routes= [
        {
            path:"/",
            element:Loadable(React.lazy(()=>import('../layouts/Default')))(props),
            children:[
                {
                    path:"",
                    element:Loadable(React.lazy(()=>import('../pages/index')))(props),
                },
                {
                    path:"auth/signin",
                    element:Loadable(React.lazy(()=>import('../pages/auth/signin')))(props),
                }
            ]
        },
        {
            path:"/admin",
            element:Loadable(React.lazy(()=>import('../layouts/Frame')))(props),
            children:[
                {
                    path:"dashboard",
                    element:Loadable(React.lazy(()=>import('../pages/dashboard')))(props),
                },
                {
                    path:"users",
                    element:Loadable(React.lazy(()=>import('../pages/users')))(props),
                },
                {
                    path:"products/categories",
                    element:Loadable(React.lazy(()=>import('../pages/products/categories')))(props),
                    auth:true
                },
                {
                    path:"products",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/products')))(props),
                },
                
                {
                    path:"orders",
                    element:Loadable(React.lazy(()=>import('../pages/orders')))(props),
                    auth:true
                },

                {
                    path:"posts",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/posts')))(props),
                },
                {
                    path:"posts/categories",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/posts/categories')))(props),
                },
                {
                    path:"members",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/members')))(props),
                },
                {
                    path:"events",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/events')))(props),
                },
                {
                    path:"subscribers",
                    auth:true,
                    element:Loadable(React.lazy(()=>import('../pages/subscribers')))(props),
                },
            ]
        },
        {
            path:"*",
            element:Loadable(React.lazy(()=>import('../pages/index')))(props), 
        }
        
    ]
    React.useEffect(()=>{
        axios.get(`${BACKEND_URL}/auth/verify`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                dispatch(authSuccess(response.data.data))
            }else{
                const route=matchRoutes(routes,window.location)[matchRoutes(routes,window.location).length-1];
                if(route.route.auth) return navigate("/")
            }
        })
    },[])
    return useRoutes(routes);
}
const Redirect=props=>{
    const navigate=useNavigate()
    React.useEffect(()=>{
        navigate(props.to)
    },[])
    return <></>
}
export default AppRoutes;