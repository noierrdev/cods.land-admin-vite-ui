import { Divider, IconButton, TextField, Typography ,Fab,Button, Tooltip,Paper, Grid,Avatar} from "@mui/material";
// import Box from '@mui/material/Box'
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { BlockOutlined, CheckOutlined, DeleteOutlined,AddOutlined,ListOutlined,ImageOutlined, Check, Block, PunchClock, Timelapse, Timer, TimerOutlined, CalendarMonth, TableBar, TableRows, Event } from "@mui/icons-material";
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Confirm from "../../components/general/Confirm";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {Link} from 'react-router-dom'
export default function(props){
    const [PageData,setPageData]=React.useState(null);
    const [DeleteAppointment, setDeleteAppointment]=React.useState(null);
    const snackbar=useSnackbar();
    const [ShowAppointment,setShowAppointment]=React.useState(null);
    const [EditAppointment,setEditAppointment]=React.useState(false);
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const refImage=React.useRef(null);
    const refStart=React.useRef(null);
    const refEnd=React.useRef(null);
    const [LogoImage,setLogoImage]=React.useState(null);
    const navigate=useNavigate();
    useAuth()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/appointments/page`,{page,pagesize},{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                
                setPageData(response.data.data)
            }
        })
    }
    // const saveEvent=()=>{
    //     if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
    //     const myForm=new FormData();
    //     myForm.append('title',refTitle.current.value);
    //     myForm.append('start',refStart.current.value);
    //     myForm.append('end',refEnd.current.value);
    //     myForm.append('description',refDescription.current.value);
    //     myForm.append("logo",LogoImage);
    //     axios.post(`${BACKEND_URL}/events/`,myForm,{
    //         headers:{
    //             token:sessionStorage.getItem('token')
    //         }
    //     })
    //     .then(response=>{
    //         if(response.data.status==="success"){
    //             setEditEvent(false);
    //             setLogoImage(null)
    //             getPageData(PageData.page,PageData.pagesize);
    //         }
    //     })
    // }
    const deleteAppointment=(order_id)=>{
        axios.delete(`${BACKEND_URL}/appointments/${order_id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted successfully",{variant:'success'})
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const headers=[
        {
            title:"User",
            component:(row)=><div>{row.user.fullname}</div>
        },
        {
            title:"address",
            component:row=><>{`${row.address}`}</>
        },
        {
            title:"Date",
            component:row=>{
                
                return <div>
                    {`${row.year}-${(Number(row.month)+1).toString().padStart(2,0)}-${Number(row.day).toString().padStart(2,0)}`}
                    </div>
            }
        },
        {
            title:"Time",
            component:(row)=>{
                const from=new Date(row.from);
                const to=new Date(row.to);
                const from_hr=from.getHours();
                const from_min=from.getMinutes();
                const to_hr=to.getHours();
                const to_min=to.getMinutes();
                return (
                    <div>
                        {`${Number(from_hr).toString().padStart(2,0)}:${Number(from_min).toString().padStart(2,0)} - ${Number(to_hr).toString().padStart(2,0)}:${Number(to_min).toString().padStart(2,0)}`}
                    </div>
                )
            }
        },
        {
            title:"Accepted",
            component:row=>{
                return (
                    <IconButton>
                        {row.accepted?<Check color="primary" />:<TimerOutlined color="secondary" />}
                    </IconButton>
                )
            }
        },
        {
            title:"Status",
            component:row=>{
                const current_time=new Date();
                const time=new Date(row.time);
                return (
                    <div>
                        {time<current_time?<>Expired</>:<>Waiting</>}
                    </div>
                )
            }
        },
        {
            title:"Created",
            component:row=><div  >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteAppointment(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            {/* <Box margin={1} > */}
            <Typography variant='h3' component={'h3'} >Appointments</Typography>
            <div style={{margin:2}} >
                <Link to="/admin/appointments/" style={{margin:2}} ><Fab variant='extended' color='primary' ><CalendarMonth/>Calendar</Fab></Link>
                <Link to="/admin/appointments/table" style={{margin:2}} ><Fab variant='extended' color='primary' ><TableRows/>Table</Fab></Link>
                <Link to="/admin/appointments/events" style={{margin:2}} ><Fab variant='extended' color='primary' ><Event/>Events</Fab></Link>
            
            </div>
            {/* </Box> */}
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Confirm open={DeleteAppointment?true:false} onOk={e=>deleteAppointment(DeleteAppointment)} onCancel={e=>setDeleteAppointment(null)} />
        </>
    )
}
