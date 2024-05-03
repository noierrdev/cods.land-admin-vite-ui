import React from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'react-big-calendar/lib/css/react-big-calendar.css';
import axios from 'axios';
import { BACKEND_URL } from '../../AppConfigs';
const localizer = momentLocalizer(moment)
const AppointmentsPage=props=>{
    const [Events,setEvents]=React.useState([]);
    const getEvents=(e)=>{
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
            }
        })
    }
    return (
        <>
        <Calendar
        localizer={localizer}
        events={[

        ]}
        onSelectEvent={e=>console.log(e)}
        startAccessor="start"
        endAccessor="end"
        onRangeChange={getEvents}
        style={{ height: 800,marginTop:20 }}
        />
        </>
    )
}
export default AppointmentsPage;