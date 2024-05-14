import React from 'react'
import { 
    Avatar, Fab, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material"
import MyDataTable from '../../components/datagrid/MyDataTable'
import { AddOutlined, BlockOutlined, CheckOutlined, DeleteOutlined } from "@mui/icons-material"
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import Confirm from '../../components/general/Confirm'

const AdminMembersPage=props=>{
    const [PageData,setPageData]=React.useState(null)
    const [DeleteCategory,setDeleteCategory]=React.useState(null)
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/members/page`,{
            page,pagesize
        },{
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
    const headers=[
        {
            title:"",
            component:row=><Avatar src={`${BACKEND_URL}/auth/avatars/${row.user.email}`} ></Avatar>
        },
        {
            title:"Fullname",
            component:row=>row.user.fullname
        },
        {
            title:"Email",
            component:row=>row.user.email
        },
        {
            title:"Expiring",
            component:row=><>{row.expired.slice(0,10)}</>
        },
        {
            title:"Type",
            component:row=><>{row.type}</>
        },
        {
            title:"Allow",
            component:row=><IconButton>{row.allow?(<CheckOutlined color='primary' />):(<BlockOutlined color='secondary' />)}</IconButton>
        },
        {
            title:"Delete",
            component:row=><IconButton  ><DeleteOutlined color='secondary' /></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={'h3'} >Members</Typography>
            {/* <Fab sx={{margin:2}} color="primary" variant="extended" ><AddOutlined/>New Users</Fab> */}
            <MyDataTable onFetchData={(page,pagesize)=>getPageData(page,pagesize)} pagedata={PageData&&PageData.pagedata} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} page={PageData&&PageData.page} headers={headers} />
            <Confirm open={DeleteCategory?true:false} onOk={e=>setDeleteCategory(null)} onCancel={e=>setDeleteCategory(null)} />
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={false}
            >
                <DialogTitle>
                    
                </DialogTitle>
                <DialogContent>

                </DialogContent>
                <DialogActions>

                </DialogActions>
            </Dialog>
        </>
    )
}

export default AdminMembersPage