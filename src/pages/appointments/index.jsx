import React, { useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { BACKEND_URL } from '../../AppConfigs';
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Typography } from '@mui/material';
import { CalendarMonth, Email, GpsFixed, GpsNotFixed, LocationCity, LocationOn, Note, Person, Phone, PhoneOutlined } from '@mui/icons-material';
const localizer = momentLocalizer(moment)
const AppointmentsPage=props=>{
    const [Events,setEvents]=React.useState([]);
    const [ViewEvent,setViewEvent]=React.useState(null);
    const viewEvent=(event)=>{
        axios.get(`${BACKEND_URL}/appointments/${event.resource._id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                const fromDate=new Date(response.data.data.from);
                const toDate=new Date(response.data.data.to);

                const fromHour=String(fromDate.getHours()).padStart(2, '0');
                const fromMinutes=String(fromDate.getMinutes()).padStart(2, '0');
                const fromMonth=String(fromDate.getMonth()+1).padStart(2, '0');
                const fromDay=String(fromDate.getDate()).padStart(2, '0');
                const fromTime=`${fromHour}:${fromMinutes}`;
                const fromDateStr=`${fromMonth}/${fromDay}`;

                const toHour=String(toDate.getHours()).padStart(2, '0');
                const toMinutes=String(toDate.getMinutes()).padStart(2, '0');
                const toMonth=String(toDate.getMonth()+1).padStart(2, '0');
                const toDay=String(toDate.getDate()).padStart(2, '0');
                const toTime=`${toHour}:${toMinutes}`;
                const toDateStr=`${toMonth}/${toDay}`;

                setViewEvent({...response.data.data,fromTime,fromDateStr,toTime,toDateStr})
                
            }
        })
    }
    useEffect(()=>{
        const date=new Date();
        const year=date.getFullYear();
        const month=date.getMonth();
        const start_month=new Date(year,month,1);
        const nextMonthFirstDay = new Date(year, month + 1, 1);
        const end_month=new Date(nextMonthFirstDay.getTime()-1);
        getEvents({start:start_month,end:end_month});
    },[])
    const getEvents=(e)=>{
        setEvents([])
        axios.post(`${BACKEND_URL}/appointments/calendar`,{
            range:e
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                // setEvents([...response.data.data])
                var events_list=[];
                response.data.data.forEach(event => {
                    const fromDate=new Date(event.from);
                    const toDate=new Date(event.to);
                    const fromHour=String(fromDate.getHours()).padStart(2, '0');
                    const fromMinutes=String(fromDate.getMinutes()).padStart(2, '0');
                    const fromTime=`${fromHour}:${fromMinutes}`;
                    const toHour=String(toDate.getHours()).padStart(2, '0');
                    const toMinutes=String(toDate.getMinutes()).padStart(2, '0');
                    const toTime=`${toHour}:${toMinutes}`;
                    events_list.push({
                        start:fromDate,
                        end:toDate,
                        title:`${event.user.fullname} ${fromTime}-${toTime}`,
                        resource:event
                    })
                });
                setEvents([
                    ...events_list,
                ])
            }
        })
    }
    return (
        <>
        <Calendar
        localizer={localizer}
        events={Events}
        onNavigate={e=>console.log(e)}
        onSelectEvent={e=>viewEvent(e)}
        startAccessor="start"
        endAccessor="end"
        onRangeChange={getEvents}
        style={{ height: 800,marginTop:20 }}
        popup={true}
        />
        <Dialog
        open={ViewEvent?true:false}
        onClose={e=>setViewEvent(null)}
        maxWidth={'md'}
        fullWidth
        >
            <DialogTitle>
                {ViewEvent&&ViewEvent.user.fullname}
            </DialogTitle>
            <DialogContent>
                <div style={{display:"flex",alignItems:'center'}} >
                    {ViewEvent&&<Avatar src={`${BACKEND_URL}/auth/avatars/${ViewEvent.user.email}`} sx={{width:50,height:50}} />}<Typography>&nbsp; {ViewEvent&&(ViewEvent.user.fullname)}</Typography>
                </div>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <CalendarMonth/><Typography>From : {ViewEvent&&(ViewEvent.fromDateStr+" "+ViewEvent.fromTime)}</Typography>
                </div>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <CalendarMonth/><Typography>To : {ViewEvent&&(ViewEvent.toDateStr+" "+ViewEvent.toTime)}</Typography>
                </div>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <Email/><Typography>Email : {ViewEvent&&(ViewEvent.user.email)}</Typography>
                </div>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <Phone/><Typography>Phone : {ViewEvent&&(ViewEvent.user.phonenumber)}</Typography>
                </div>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <LocationOn/><Typography>Location : {ViewEvent&&(ViewEvent.location)}</Typography>
                </div>
                <Divider/>
                <div style={{display:"flex",alignItems:'center',marginTop:10}} >
                    <Note/><Typography>Detail</Typography>
                </div>
                <Typography>{ViewEvent&&ViewEvent.detail}</Typography>
                
            </DialogContent>
            <DialogActions>
                <Button
                variant='outlined'
                onClick={e=>setViewEvent(null)}
                >
                    Close
                </Button>
            </DialogActions>
        </Dialog>
        </>
    )
}
export default AppointmentsPage;