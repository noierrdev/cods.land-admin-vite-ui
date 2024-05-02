import React from 'react'
import { 
    Avatar, Fab, IconButton, Typography,
    Dialog, DialogTitle, DialogContent, DialogActions,Paper,Button,
    TextField
} from "@mui/material"
import MyDataTable from '../../components/datagrid/MyDataTable'
import { AddOutlined,TableChartOutlined, BlockOutlined, CheckOutlined, DeleteOutlined, CategoryOutlined, UploadOutlined, PlusOneOutlined, Delete, DownloadOutlined, MailOutlined } from "@mui/icons-material"
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import Confirm from '../../components/general/Confirm'
import { useNavigate } from 'react-router-dom'
import { useSnackbar } from 'notistack'

const AdminSubscribersPage=props=>{
    const snackbar=useSnackbar();
    const [PageData,setPageData]=React.useState(null)
    const [DeleteSubscriber,setDeleteSubscriber]=React.useState(null)
    const [UploadModal,setUploadModal]=React.useState(false);
    const [AddModal,setAddModal]=React.useState(false);
    const [DeleteAllModal,setDeleteAllModal]=React.useState(false);
    const refCSV=React.useRef(null);
    const [CSVFile,setCSVFile]=React.useState(null);
    const navigate=useNavigate();
    const refFullname=React.useRef(null);
    const refEmail=React.useRef(null);
    const refSearch=React.useRef(null);

    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/subscribers/page`,{
            page,pagesize,search:refSearch.current.value
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
    const handleInputSearch=e=>{
        getPageData(PageData.page,PageData.pagesize)
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
            title:"Send Private mail",
            component:row=><IconButton onClick={e=>{}} ><MailOutlined color='primary' /></IconButton>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteSubscriber(row._id)} ><DeleteOutlined color='secondary' /></IconButton>
        }
    ]
    const uploadCSV=()=>{
        if(!CSVFile) return;
        const myForm=new FormData();
        myForm.append('csv',CSVFile)
        axios.post(`${BACKEND_URL}/subscribers/upload`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            snackbar.enqueueSnackbar("Uploaded Successfully",{variant:"success"})
            setAddModal(false);
            getPageData(PageData.page,PageData.pagesize)
        })
    }
    const deleteSubscriber=()=>{
        axios.delete(`${BACKEND_URL}/subscribers/${DeleteSubscriber}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted Successfully",{variant:"success"})
                setDeleteSubscriber(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const deleteAll=()=>{
        axios.delete(`${BACKEND_URL}/subscribers/all`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted Successfully",{variant:"success"})
                setDeleteSubscriber(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const saveSubscriber=()=>{
        if(!refFullname.current.value||!refEmail.current.value) return;
        axios.post(`${BACKEND_URL}/subscribers/`,{
            fullname:refFullname.current.value,
            email:refEmail.current.value
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Added Successfully",{variant:"success"})
                setAddModal(false)
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    return (
        <>
            <Typography variant="h3" component={'h3'} >Subscribers</Typography>
            {/* <Fab sx={{margin:2}} color="primary" variant="extended" ><AddOutlined/>New Users</Fab> */}
            <div>
                <Fab sx={{margin:1}} onClick={e=>setAddModal(true)} variant="extended" color="warning" ><AddOutlined/>Add one</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadModal(true)} variant="extended" color="primary" ><UploadOutlined/>Upload CSV</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadModal(true)} variant="extended" color="success" ><DownloadOutlined/>Download CSV</Fab>
                <Fab sx={{margin:1}} onClick={e=>setDeleteAllModal(true)} variant="extended" color="secondary" ><DeleteOutlined/>Delete All</Fab>
            </div>
            <TextField placeholder='search' fullWidth margin='normal' size='small' inputRef={refSearch} onChange={handleInputSearch} />
            <MyDataTable onFetchData={(page,pagesize)=>getPageData(page,pagesize)} pagedata={PageData&&PageData.pagedata} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} page={PageData&&PageData.page} headers={headers} />
            <Confirm open={DeleteSubscriber?true:false} onOk={e=>deleteSubscriber()} onCancel={e=>setDeleteSubscriber(null)} />
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={AddModal}
                onClose={e=>setAddModal(false)}
            >
                <DialogTitle>
                    Add subscriber
                </DialogTitle>
                <DialogContent>
                    <TextField
                    fullWidth
                    variant='outlined'
                    label="fullname"
                    margin='normal'
                    inputRef={refFullname}
                    />
                    <TextField
                    fullWidth
                    variant='outlined'
                    label="email"
                    margin='normal'
                    inputRef={refEmail}
                    />
                </DialogContent>
                <DialogActions>
                    <Button color='primary' variant='outlined' onClick={e=>setAddModal(false)} >Cancel</Button>
                    <Button color='primary' variant='contained' onClick={e=>saveSubscriber()}  >Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                open={UploadModal}
                onClose={e=>setUploadModal(false)}
            >
                <DialogTitle>
                    Upload CSV
                </DialogTitle>
                <DialogContent>
                <Paper onClick={e=>refCSV.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                    {CSVFile?(
                        <TableChartOutlined sx={{fontSize:"5vw",color:'darkgray'}} />
                    ):(
                        <>
                        {/* <ImageOutlined style={{fontSize:"10vw",color:"gray"}} /> */}
                        <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload CSV File</Typography>
                        </>
                    )}
                </Paper>
                <input hidden accept=".csv" onChange={e=>setCSVFile(e.target.files[0])} type="file" ref={refCSV} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setUploadModal(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>uploadCSV()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteAllModal} onCancel={e=>setDeleteAllModal(false)} onOk={e=>{deleteAll()}} text={`Are you sure to delete all subscribers?`} />
        </>
    )
}

export default AdminSubscribersPage