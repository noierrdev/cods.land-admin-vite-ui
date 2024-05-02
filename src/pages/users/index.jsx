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

const AdminUsersPage=props=>{
    const [PageData,setPageData]=React.useState(null)
    const [DeleteCategory,setDeleteCategory]=React.useState(null)
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/admin/users/page`,{
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
            component:row=><Avatar src={`${BACKEND_URL}/auth/avatars/${row.email}`} ></Avatar>
        },
        {
            title:"Fullname",
            body:"fullname"
        },
        {
            title:"Email",
            body:"email"
        },
        {
            title:"Gender",
            body:"gender"
        },
        {
            title:"City",
            body:"city"
        },
        {
            title:"Country",
            body:"country"
        },
        {
            title:"Allow",
            component:(row)=><IconButton>{row.allow?<CheckOutlined color='primary'></CheckOutlined>:<BlockOutlined color='secondary' ></BlockOutlined>}</IconButton>
        },
        {
            title:"Verified",
            component:(row)=><IconButton>{row.verified?<CheckOutlined color='primary'></CheckOutlined>:<BlockOutlined color='secondary' ></BlockOutlined>}</IconButton>
        },
        {
            title:"Superuser",
            component:row=><IconButton>{row.superuser?<CheckOutlined color='primary' ></CheckOutlined>:<BlockOutlined color='secondary' ></BlockOutlined>}</IconButton>
        },
        {
            title:"Registered",
            component:row=>row.createdAt&&row.createdAt.slice(0,10)
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteCategory(row._id)} ><DeleteOutlined color='secondary' /></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={'h3'} >Users</Typography>
            {/* <Fab sx={{margin:2}} color="primary" variant="extended" ><AddOutlined/>New Users</Fab> */}
            <MyDataTable onFetchData={(page,pagesize)=>getPageData(page,pagesize)} pagedata={PageData&&PageData.pagedata} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} page={PageData&&PageData.page} headers={headers} />
            <Confirm open={DeleteCategory?true:false} onOk={e=>setDeleteCategory(null)} onCancel={e=>setDeleteCategory(null)} />
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
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

export default AdminUsersPage