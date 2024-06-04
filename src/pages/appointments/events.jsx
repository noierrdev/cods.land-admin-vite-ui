import { Divider, IconButton,Fab,Typography, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Grid} from "@mui/material";
// import Box from '@mui/material/Box'
import React, { useRef } from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { DeleteOutlined, Check,  TimerOutlined, Add, CalendarMonth, TableChart, TableBar, TableRows, Event, Block } from "@mui/icons-material";

import Confirm from "../../components/general/Confirm";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import {Link} from 'react-router-dom'

export default function(props){
    const [PageData,setPageData]=React.useState(null);
    const [DeleteAppointment, setDeleteAppointment]=React.useState(null);
    const [NewEventModal,setNewEventModal]=React.useState(false);
    const refTitle=useRef(null);
    const refLocation=useRef(null);
    const refDescription=useRef(null);
    const refStart=useRef(null);
    const refEnd=useRef(null);
    const refFrom=useRef(null);
    const refTo=useRef(null);
    const navigate=useNavigate();
    const snackbar=useSnackbar();
    useAuth()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/appointments/events/page`,{page,pagesize},{
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
    const saveEvent=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
        const myForm=new FormData();
        myForm.append('title',refTitle.current.value);
        myForm.append('start_date',refStart.current.value);
        myForm.append('end_date',refEnd.current.value);
        myForm.append('start_time',refFrom.current.value);
        myForm.append('end_time',refTo.current.value);
        myForm.append('description',refDescription.current.value);
        myForm.append("location",refLocation.current.value);
        axios.post(`${BACKEND_URL}/appointments/events/`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setNewEventModal(false);
                getPageData(PageData.page,PageData.pagesize);
            }else {
                snackbar.enqueueSnackbar(response.data?.error,{variant:"error"})
            }
        })
    }
    const deleteAppointmentEvent=(order_id)=>{
        axios.delete(`${BACKEND_URL}/appointments/events/${order_id}`,{
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
            title:"Location",
            component:row=><>{`${row.location}`}</>
        },
        {
            title:"Start Date",
            component:row=>{
                const start=new Date(row.start_date);
                const start_year=start.getFullYear();
                const start_month=start.getMonth();
                const start_day=start.getDate();
                return (
                    <div>{`${start_year}-${Number(start_month+1).toString().padStart(2,0)}-${Number(start_day+1).toString().padStart(2,0)}`}</div>
                )
            }
        },
        {
            title:"End Date",
            component:row=>{
                const end=new Date(row.end_date);
                const end_year=end.getFullYear();
                const end_month=end.getMonth();
                const end_day=end.getDate();
                return (
                    <div>{`${end_year}-${Number(end_month+1).toString().padStart(2,0)}-${Number(end_day+1).toString().padStart(2,0)}`}</div>
                )
            }
        },
        {
            title:"Start Time",
            component:row=>{
                const startTime=row.start_time;
                const startHrs=parseInt(startTime);
                const startMins=parseFloat(startTime)-startHrs;
                const start_time=`${String(startHrs).padStart(2,0)}:${String(parseInt(startMins*60)).padStart(2,0)}`
                return (
                    <div>{start_time}</div>
                )
            }
        },
        {
            title:"End Time",
            component:row=>{
                const endTime=row.end_time;
                const endHrs=parseInt(endTime);
                const endMins=parseFloat(endTime)-endHrs;
                const end_time=`${String(endHrs).padStart(2,0)}:${String(parseInt(endMins*60)).padStart(2,0)}`
                return (
                    <div>{end_time}</div>
                )
            }
        },
        {
            title:"Created",
            component:row=><div >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteAppointmentEvent(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            {/* <Box margin={1} > */}
            <Typography variant='h3' component={'h3'} >Events</Typography>
            <div style={{margin:2}} >
                <Link to="/admin/appointments/" style={{margin:2}} ><Fab variant='extended' color='primary' ><CalendarMonth/>Calendar</Fab></Link>
                <Link to="/admin/appointments/table" style={{margin:2}} ><Fab variant='extended' color='primary' ><TableRows/>Table</Fab></Link>
                <Link to="/admin/appointments/events" style={{margin:2}} ><Fab variant='extended' color='primary' ><Event/>Events</Fab></Link>
                <Fab variant='extended' sx={{margin:2}}  color="success" onClick={e=>setNewEventModal(true)} ><Add/>Add</Fab>
            </div>
            {/* </Box> */}
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Confirm open={DeleteAppointment?true:false} onOk={e=>deleteAppointment(DeleteAppointment)} onCancel={e=>setDeleteAppointment(null)} />
            <Dialog
                open={NewEventModal}
                maxWidth="sm"
                fullWidth
                onClose={e=>setNewEventModal(false)}
            >
                <DialogTitle>
                    New Event
                </DialogTitle>
                <DialogContent>
                    <TextField
                    fullWidth
                    variant="outlined"
                    label="Title"
                    margin="normal"
                    inputRef={refTitle}
                    />
                    <Grid container spacing={2} >
                        <Grid item xs={6} >
                            <TextField
                            fullWidth
                            variant="outlined"
                            label="Start"
                            margin="normal"
                            inputRef={refStart}
                            type="date"
                            focused
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                            fullWidth
                            variant="outlined"
                            label="End"
                            margin="normal"
                            inputRef={refEnd}
                            type="date"
                            focused
                            />
                        </Grid>
                    </Grid>
                    <Grid container spacing={2} >
                        <Grid item xs={6} >
                            <TextField
                            fullWidth
                            variant="outlined"
                            label="From"
                            margin="normal"
                            inputRef={refFrom}
                            type="time"
                            focused
                            />
                        </Grid>
                        <Grid item xs={6} >
                            <TextField
                            fullWidth
                            variant="outlined"
                            label="To"
                            margin="normal"
                            inputRef={refTo}
                            type="time"
                            focused
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Location"
                        margin="normal"
                        inputRef={refLocation}
                    />
                    <TextField
                        fullWidth
                        variant="outlined"
                        label="Description"
                        margin="normal"
                        multiline
                        inputRef={refDescription}
                        rows={5}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={e=>setNewEventModal(false)} variant="outlined" >
                        <Block/>Cancel
                    </Button>
                    <Button onClick={saveEvent}  variant="contained" >
                        <Check/>Save
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}
