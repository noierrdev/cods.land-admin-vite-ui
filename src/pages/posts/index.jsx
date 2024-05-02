import { Divider, IconButton, Typography,Fab, TextField } from "@mui/material";
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { BlockOutlined, CheckOutlined, DeleteOutlined ,CategoryOutlined} from "@mui/icons-material";
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
    const [DeletePost, setDeletePost]=React.useState(null);
    const snackbar=useSnackbar();
    const navigate=useNavigate();
    const [ShowPost,setShowPost]=React.useState(null);
    const refSearch=React.useRef();
    useAuth();
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shared-contents/page`,{page,pagesize,search:refSearch.current.value},{
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
    const handleSearchInput=(e)=>{
        getPageData(PageData.page,PageData.pagesize);
    }
    const deletePost=(order_id)=>{
        axios.delete(`${BACKEND_URL}/shared-contents/${order_id}`,{
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
            component:row=><div onClick={e=>setShowPost(row)} ><Typography>{row.title}</Typography></div>
        },
        {
            title:"Category",
            component:row=><div onClick={e=>setShowPost(row)} >{row.category.title}</div>
        },
        {
            title:"Author",
            component:row=><div onClick={e=>setShowPost(row)} >{row.author&&row.author.fullname}</div>
        },
        {
            title:"Created",
            component:row=><div onClick={e=>setShowPost(row)} >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeletePost(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Posts</Typography>
            <div>
                <Fab sx={{margin:1}} onClick={e=>navigate("/admin/posts/categories")} variant="extended" color="primary" ><CategoryOutlined/>Categories</Fab>
            </div>
            <TextField onChange={handleSearchInput} size="small" margin="normal" variant="outlined" fullWidth placeholder="Search" inputRef={refSearch} />
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Dialog
                open={ShowPost?true:false}
                onClose={e=>setShowPost(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Post Detail</DialogTitle>
                <DialogContent>
                    
                    {ShowPost&&(
                        <>
                            <Typography variant="h4" component={'h4'} >{ShowPost.title}</Typography>
                            <Divider/>
                            <div style={{display:"flex"}} >
                                <Typography>{ShowPost.author&&ShowPost.author.fullname+" "+ShowPost.author.email}</Typography>
                                <div style={{flexGrow:1}} ></div>
                                <Typography>{ShowPost.createdAt.slice(0,10)}</Typography>
                            </div>
                            <Divider/>
                            <Typography>
                                {ShowPost.description}
                            </Typography>
                            {ShowPost.media&&(
                                <img style={{width:'100%'}}  src={`${BACKEND_URL}/shared-contents/media/${ShowPost._id}`} />
                            )}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                {/* <Button variant="outlined" onClick={e=>setShowOrder(false)}>Cancel</Button> */}
                {/* <Button variant="contained" onClick={e=>saveProduct()}>Save</Button> */}
                </DialogActions>
            </Dialog>
            <Confirm open={DeletePost?true:false} onOk={e=>deletePost(DeletePost)} onCancel={e=>setDeletePost(null)} />
        </>
    )
}
export default AdminPostsPage