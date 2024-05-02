import { Divider, IconButton, Typography } from "@mui/material";
import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import axios from 'axios'
import { BACKEND_URL } from "../../AppConfigs";
import { useSnackbar } from "notistack";
import { BlockOutlined, BookOutlined, CheckOutlined, DeleteOutlined } from "@mui/icons-material";
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
import useAuth from "../../hooks/useAuth";

const AdminOrdersPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [DeleteOrder,setDeleteOrder]=React.useState(null);
    const [ShowOrder,setShowOrder]=React.useState(null);
    const snackbar=useSnackbar()
    useAuth()
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/orders/page`,{page,pagesize},{
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
    const deleteOrder=(order_id)=>{
        axios.delete(`${BACKEND_URL}/shop/orders/${order_id}`,{
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
    const acceptOrder=(order_id)=>{
        axios.put(`${BACKEND_URL}/shop/orders/accept`,{
            order:order_id
        },{
            headers:{
                token:sessionStorage.getItem('token')
            } 
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Accepted successfully",{variant:'success'})
                getPageData(PageData.page,PageData.pagesize)
            }else{
                snackbar.enqueueSnackbar("Shipping request failed, Please try again",{variant:"error"})
            }
        })
    }
    const cancelOrder=(order_id)=>{

    }
    const headers=[
        {
            title:"Buyer",
            component:row=><div onClick={e=>setShowOrder(row)} ><Typography>{row.user.fullname}</Typography><p>{row.user.email}</p></div>
        },
        {
            title:"Total Price",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.price+" USD $"}</div>
        },
        {
            title:"Amount Of Products",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.products.length}</div>
        },
        {
            title:"Ordered Date",
            component:row=><div onClick={e=>setShowOrder(row)} >{row.createdAt.slice(0,10)}</div>
        },
        {
            title:"Shipping Rate",
            component:row=><Typography>{row.shipping_rate&&row.shipping_rate.amount}</Typography>
        },
        {
            title:"Accepted",
            component:row=><>{!row.shipping_transaction?<IconButton onClick={e=>acceptOrder(row._id)} ><BlockOutlined color="secondary" /></IconButton>:<IconButton onClick={e=>cancelOrder(row._id)} ><CheckOutlined color="primary" /></IconButton>}</>
        },
        {
            title:"Status",
            component:row=><div  >{row.shipping_transaction&&<a target="_blank" href={row.shipping_transaction&&row.shipping_transaction.label_url} ><IconButton><BookOutlined color="primary" /></IconButton></a>}</div>
        },
        {
            title:"Delete",
            component:row=><IconButton onClick={e=>setDeleteOrder(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    return (
        <>
            <Typography variant="h3" component={`h3`} >Orders</Typography>
            <MyDataTable pagedata={PageData&&PageData.pagedata} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumber} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} headers={headers} />
            <Dialog
                open={ShowOrder?true:false}
                onClose={e=>setShowOrder(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Order Detail</DialogTitle>
                <DialogContent>
                    
                    {ShowOrder&&(
                        <>
                            <Typography>Buyer: {ShowOrder.user.fullname} {ShowOrder.user.email}</Typography>
                            <List>
                                {ShowOrder.products.map((oneProduct,index)=>{
                                    return oneProduct.product&&(
                                        <ListItem key={index} >
                                            <ListItemAvatar>
                                                <img style={{width:"10vh"}} src={oneProduct.product.image_url?oneProduct.product.image_url:`${BACKEND_URL}/shop/products/${oneProduct.product._id}/image`} />
                                            </ListItemAvatar>
                                            <ListItemText sx={{marginLeft:2}} primary={oneProduct.product.title+" X "+oneProduct.count} secondary={
                                                oneProduct.product.price+" X "+oneProduct.count+" = "+(Number(oneProduct.product.price)*Number(oneProduct.count)+" USD $")
                                                } >
                                            </ListItemText>
                                        </ListItem>
                                    )
                                })}
                                {ShowOrder.shipping_rate&&(
                                    <ListItem  >
                                        <ListItemAvatar>
                                            <img style={{width:"10vh"}} src={ShowOrder.shipping_rate.provider_image_75} />
                                        </ListItemAvatar>
                                        <ListItemText sx={{marginLeft:2}} primary={`${ShowOrder.shipping_rate.provider} : ${ShowOrder.shipping_rate.servicelevel.display_name}`} secondary={
                                            Number(ShowOrder.shipping_rate.amount).toFixed(2)+" USD $"
                                            } >
                                        </ListItemText>
                                    </ListItem>
                                )}
                            </List>
                        </>
                    )}
                    <Divider/>
                    <Typography component={`h3`} variant="h3" >Total: {(Number(ShowOrder&&ShowOrder.price)+Number(ShowOrder&&ShowOrder.shipping_rate&&ShowOrder.shipping_rate.amount)).toFixed(2)} USD $</Typography>
                    <Typography component={`h5`} variant="h5">{ShowOrder&&ShowOrder.createdAt.slice(0,10)}</Typography>
                </DialogContent>
                <DialogActions>
                {/* <Button variant="outlined" onClick={e=>setShowOrder(false)}>Cancel</Button> */}
                {/* <Button variant="contained" onClick={e=>saveProduct()}>Save</Button> */}
                </DialogActions>
            </Dialog>
            <Confirm open={DeleteOrder?true:false} onOk={e=>deleteOrder(DeleteOrder)} onCancel={e=>setDeleteOrder(null)} />
        </>
    )
}
export default AdminOrdersPage;