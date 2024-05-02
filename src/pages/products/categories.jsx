import { Fab, IconButton, Typography } from '@mui/material';
import React from 'react';
import { AddOutlined, DeleteOutlined} from '@mui/icons-material'
import MyDataTable from '../../components/datagrid/MyDataTable';
import axios from 'axios'
import { BACKEND_URL } from '../../AppConfigs';
import Confirm from '../../components/general/Confirm';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { useSnackbar } from 'notistack';

const AdminProductCategoriesPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [DeleteCategory,setDeleteCategory]=React.useState(null)
    const [NewCategory, setNewCategory]=React.useState(false);
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const snackbar=useSnackbar();
    const saveCategory=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title",{variant:"error"});
        if(!refDescription.current.value) return snackbar.enqueueSnackbar("Input Description",{variant:"error"});
        axios.post(`${BACKEND_URL}/shop/categories`,{
            title:refTitle.current.value,
            description:refDescription.current.value
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                snackbar.enqueueSnackbar("Successfully saved",{variant:"success"})
                getPageData(PageData.page,PageData.pagesize);
                setNewCategory(false);
            }
        })
    }
    const deleteCategory=(category_id)=>{
        axios.delete(`${BACKEND_URL}/shop/categories/${category_id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status=="success"){
                getPageData(PageData.page,PageData.pagesize);
                setDeleteCategory(null);
                snackbar.enqueueSnackbar("Deleted successfully",{variant:"success"});
            }
        })
    }
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/categories/page`,{
            page,
            pagesize
        })
        .then(response=>{
            if(response.data.status==="success"){
                setPageData(response.data.data)
            }
        })
    }
    // React.useEffect(()=>{
    //     if(!PageData)
    //     getPageData(0,10)
    // },[])
    const headers=[
        {
            title:"Title",
            body:"title",
            tooltip:row=>row.description
        },
        {
            title:"Category",
            component:row=><div>{row.description&&row.description.length>40?row.description.slice(0,40)+"...":row.description}</div>,
            tooltip:row=>row.description
        },
        {
            title:"Created",
            component:row=><Typography>{row.createdAt.slice(0,10)}</Typography>,
            tooltip:row=>row.description
        },
        {
            title:"Delete",
            component:(row)=><IconButton onClick={e=>setDeleteCategory(row._id)} ><DeleteOutlined/></IconButton>,
            tooltip:row=>row.description
        }
    ]
    return (
        <>
            <Typography variant='h3' component={`h3`} >Product Categories</Typography>
            <Fab sx={{margin:1}} onClick={e=>setNewCategory(true)} variant='extended' color='primary' ><AddOutlined/> New Category</Fab>
            <MyDataTable onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} total={PageData&&PageData.totalNumber} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} pagedata={PageData&&PageData.pagedata} />
            <Dialog
                open={NewCategory}
                onClose={e=>setNewCategory(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>New Product Category</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="normal"
                    label="Title"
                    fullWidth
                    required
                    variant="outlined"
                    inputRef={refTitle}
                />
                <TextField
                    autoFocus
                    margin="normal"
                    label="Description"
                    fullWidth
                    multiline
                    rows={10}
                    variant="outlined"
                    inputRef={refDescription}
                />
                </DialogContent>
                <DialogActions>
                <Button variant='outlined' onClick={e=>setNewCategory(false)}>Cancel</Button>
                <Button variant='contained' onClick={e=>saveCategory()}>Subscribe</Button>
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteCategory?true:false} onOk={e=>deleteCategory(DeleteCategory)} onCancel={e=>setDeleteCategory(null)} />
        </> 
    )
}
export default AdminProductCategoriesPage 