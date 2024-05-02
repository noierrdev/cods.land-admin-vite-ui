import { Divider, IconButton, TextField, Typography ,Fab,Button, Tooltip} from "@mui/material";
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { BlockOutlined, CheckOutlined, DeleteOutlined,AddOutlined,ListOutlined } from "@mui/icons-material";
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
const AdminPostsPage=(props)=>{
    const [PageData,setPageData]=React.useState(null);
    const [DeleteCategory, setDeleteCategory]=React.useState(null);
    const snackbar=useSnackbar();
    const [ShowCategory,setShowCategory]=React.useState(null);
    const [EditCategory,setEditCategory]=React.useState(false);
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const navigate=useNavigate();
    useAuth()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shared-contents/categories/page`,{page,pagesize},{
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
    const saveCategory=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
        axios.post(`${BACKEND_URL}/shared-contents/categories`,{
            title:refTitle.current.value,
            description:refDescription.current.value
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setEditCategory(false);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const deleteCategory=(order_id)=>{
        axios.delete(`${BACKEND_URL}/shared-contents/categories/${order_id}`,{
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
            title:"Title",
            component:row=><Typography>{row.title}</Typography>,
            tooltip:row=>row.description
        },
        {
            title:"Created",
            component:row=><div  >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteCategory(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Categories</Typography>
            <div>
            <Fab sx={{margin:1}} onClick={e=>navigate("/admin/posts")} variant="extended" color="primary" ><ListOutlined/>Posts</Fab>
                <Fab sx={{margin:1}} onClick={e=>setEditCategory(true)} variant="extended" color="info" ><AddOutlined/>Add category</Fab>
            </div>
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Dialog
                open={EditCategory}
                onClose={e=>setEditCategory(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Category Edit</DialogTitle>
                <DialogContent>
                    <TextField
                    variant="outlined"
                    label="Title"
                    fullWidth
                    margin="normal"
                    inputRef={refTitle}
                    />
                    <TextField
                    variant="outlined"
                    label="Description"
                    fullWidth
                    margin="normal"
                    multiline
                    inputRef={refDescription}
                    />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setEditCategory(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>saveCategory()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteCategory?true:false} onOk={e=>deleteCategory(DeleteCategory)} onCancel={e=>setDeleteCategory(null)} />
        </>
    )
}
export default AdminPostsPage