import React from "react";
import MyDataTable from "../../components/datagrid/MyDataTable";
import { Fab, Typography,Button,IconButton, Paper, MenuItem, Divider, FormControl, FormControlLabel,Checkbox, Grid } from "@mui/material";
import axios from 'axios'
import {BACKEND_URL} from '../../AppConfigs'
import {DeleteOutlined,AddOutlined,CloudUploadOutlined,CancelOutlined, ImageOutlined, TableChartOutlined, DownloadOutlined, CheckOutlined, BlockOutlined, EditOutlined, Edit} from '@mui/icons-material'
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Confirm from "../../components/general/Confirm";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import { useSnackbar } from "notistack";
import querystringify from 'querystringify'
import { useLocation, useNavigate, useNavigation} from 'react-router-dom'
import useAuth from "../../hooks/useAuth";

const AdminProductsPage=props=>{
    const [PageData,setPageData]=React.useState(null);
    const [NewProduct,setNewProduct]=React.useState(false);
    const [DeleteProduct,setDeleteProduct]=React.useState(null);
    const [ProductImage,setProductImage]=React.useState(null);
    const [AllCategories, setAllCategories]=React.useState([]);
    const [UploadFile,setUploadFile]=React.useState(false)
    const [ProductFile,setProductFile]=React.useState(null);
    const [DeleteAll,setDeleteAll]=React.useState(false);
    const [ShowProduct,setShowProduct]=React.useState(null);
    const [EditProduct,setEditProduct]=React.useState(null);
    const snackbar=useSnackbar();
    const refTitle=React.useRef(null);
    const refDescription=React.useRef(null);
    const refPrice=React.useRef(null);
    const refPublic=React.useRef(null);
    const refCategory=React.useRef(null);
    const refCategory_1=React.useRef(null);
    const refCategory_2=React.useRef(null);
    const refCategory_3=React.useRef(null);
    const refLength=React.useRef(null);
    const refWidth=React.useRef(null);
    const refHeight=React.useRef(null);
    const refWeight=React.useRef(null);
    const refImage=React.useRef(null);
    const refCSV=React.useRef(null)
    const refSearch=React.useRef(null);
    const {search}=useLocation()
    const navigate=useNavigate()
    useAuth()
    
    const getPageData=(page,pagesize)=>{
        axios.post(`${BACKEND_URL}/shop/products/page`,{
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
    const handleInputSearch=(e)=>{
        getPageData(PageData.page,PageData.pagesize);
    }
    const deleteProduct=(product_id)=>{
        axios.delete(`${BACKEND_URL}/shop/products/${product_id}`,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Deleted Successfully",{variant:"success"})
                setDeleteProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const switchPublic=(product_id,value)=>{
        axios.put(`${BACKEND_URL}/shop/products`,{
            id:product_id,
            public:value==true?false:true
        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Updated Successfully",{variant:"success"})
                // setDeleteProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const editProduct=(e)=>{
        e.preventDefault()
        const data={
            title:e.target.elements['title'].value,
            price:e.target.elements['price'].value,
            category_1:e.target.elements['category_1'].value,
            category_2:e.target.elements['category_2'].value,
            category_3:e.target.elements['category_3'].value,
            length:e.target.elements['length_'].value,
            width:e.target.elements['width'].value,
            height:e.target.elements['height'].value,
            weight:e.target.elements['weight'].value,
            public:e.target.elements['public'].checked,
            description:e.target.elements['description'].value,
        }
        axios.put(`${BACKEND_URL}/shop/products`,{
            id:EditProduct._id,
            ...data

        },{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                snackbar.enqueueSnackbar("Updated Successfully",{variant:"success"})
                setEditProduct(null);
                getPageData(PageData.page,PageData.pagesize)
            }
        })
    }
    const saveProduct=()=>{
        if(!refTitle.current.value) return snackbar.enqueueSnackbar("Input Title!",{variant:"error"})
        if(!refDescription.current.value) return snackbar.enqueueSnackbar("Input Description!",{variant:"error"});
        if(!refPrice.current.value) return snackbar.enqueueSnackbar("Input Price!",{variant:"error"})
        if(!ProductImage) return snackbar.enqueueSnackbar("Select Product Image!",{variant:"error"})
        const myForm=new FormData();
        myForm.append('title',refTitle.current.value);
        myForm.append('description',refDescription.current.value);
        // myForm.append('category',refCategory.current.value);
        myForm.append('category_1',refCategory_1&&refCategory_1.current.value);
        myForm.append('category_2',refCategory_2&&refCategory_2.current.value);
        myForm.append('category_3',refCategory_3&&refCategory_3.current.value);
        myForm.append('price',refPrice.current.value);
        myForm.append('length',refLength.current.value);
        myForm.append('width',refWidth.current.value);
        myForm.append('height',refHeight.current.value);
        myForm.append('weight',refWeight.current.value);
        myForm.append('public',refPublic.current.checked);
        myForm.append('image',ProductImage);
        axios.post(`${BACKEND_URL}/shop/products`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            if(response.data.status==="success"){
                setNewProduct(false);
                refTitle.current.value="";
                refDescription.current.value="";
                refPrice.current.value="";
                refWidth.current.value="";
                refLength.current.value="";
                refHeight.current.value="";
                refWeight.current.value="";
                setProductImage(null)
                getPageData(PageData.page,PageData.pagesize);
                snackbar.enqueueSnackbar("Saved successfully",{variant:"success"})
            }
        })
    }
    React.useEffect(()=>{
        axios.get(`${BACKEND_URL}/shop/categories`)
        .then(response=>{
            if(response.data.status==="success"){
                setAllCategories(response.data.data)
            }
        });
    },[])
    const uploadCSV=()=>{
        if(!ProductFile) return;
        const myForm=new FormData();
        myForm.append('csv',ProductFile)
        axios.post(`${BACKEND_URL}/admin/upload-csv`,myForm,{
            headers:{
                token:sessionStorage.getItem('token')
            }
        })
        .then(response=>{
            console.log(response)
        })
    }
    const headers=[
        {
            title:"Product Image",
            component:(row)=>row.image_url?<img style={{width:"5vw"}} onClick={e=>setShowProduct(row)} src={row.image_url} />:<img style={{width:"5vw"}} onClick={e=>setShowProduct(row)} src={`${BACKEND_URL}/shop/products/${row._id}/image`} />,
            tooltip:row=>row.description
        },
        {
            title:"Product Name",
            component:row=><div onClick={e=>setShowProduct(row)} ><Typography>{row.title}</Typography></div>,
            tooltip:row=>row.description
        },
        {
            title:"Price",
            component:row=><Typography>{row.price&&"$ "+(row.price.toFixed(2).toLocaleString('en-US'))}</Typography>
        },
        {
            title:"Public",
            component:row=>{return <IconButton onClick={e=>switchPublic(row._id,row.public)} >{row.public?<CheckOutlined color="primary" />:<BlockOutlined color="secondary" />}</IconButton>}
        },
        {
            title:"Count"
        },
        {
            title:"Created",
            component:row=><Typography>{row.createdAt&&row.createdAt.slice(0,10)}</Typography>
        },
        {
            title:"Edit",
            component:(row)=><IconButton size="small" onClick={e=>setEditProduct(row)} ><EditOutlined color="primary" /></IconButton>
        },
        {
            title:"Delete",
            component:(row)=><IconButton onClick={e=>setDeleteProduct(row._id)} ><DeleteOutlined/></IconButton>
        }
    ]
    
    return (
        <>
            <Typography variant="h3" component={`h3`} >Products</Typography>
            <div>
                <Fab sx={{margin:1}} onClick={e=>setNewProduct(true)} variant="extended" color="primary" ><AddOutlined/>New Product</Fab>
                <Fab sx={{margin:1}} onClick={e=>setUploadFile(true)} variant="extended" color="info" ><CloudUploadOutlined/> Upload CSV</Fab>
                <Fab sx={{margin:1}} color="secondary" variant="extended" ><DeleteOutlined />&nbsp;Delete All</Fab>
                {/* <Fab sx={{margin:1}} color="success" variant="extended" ><DownloadOutlined />&nbsp;Download CSV</Fab> */}
            </div>
            <TextField onChange={handleInputSearch} fullWidth variant="outlined" placeholder="Search" margin="normal" size="small" inputRef={refSearch} />
            <MyDataTable headers={headers} page={PageData&&PageData.page} pagesize={PageData&&PageData.pagesize} total={PageData&&PageData.totalNumbers} pagedata={PageData?PageData.pagedata:[]} onFetchData={(page,pagesize)=>getPageData(page,pagesize)} />
            <Dialog
                open={NewProduct}
                onClose={e=>setNewProduct(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Product Detail Edit</DialogTitle>
                <DialogContent>
                <TextField
                    autoFocus
                    margin="normal"
                    label="Product Name"
                    fullWidth
                    variant="outlined"
                    inputRef={refTitle}
                />
                {AllCategories&&(
                    <>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_1}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_2}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    <TextField
                        margin="normal"
                        label="Product Category"
                        fullWidth
                        select
                        inputRef={refCategory_3}
                        variant="outlined"
                        defaultValue={""}
                    >
                        <MenuItem  value={""} >
                            
                        </MenuItem>
                        {AllCategories&&AllCategories.map((oneCategory,index)=>{
                            return (
                                <MenuItem key={index} value={oneCategory._id} >
                                    {oneCategory.title}
                                </MenuItem>
                            )
                        })}
                    </TextField>
                    </>
                )}
                
                <TextField
                    label="Price"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refPrice}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">USD $</InputAdornment>,
                    }}
                />
                <TextField
                    label="Length"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refLength}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Width"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refWidth}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Height"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refHeight}
                    defaultValue={10}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">in</InputAdornment>,
                    }}
                />
                <TextField
                    label="Weight"
                    id="outlined-start-adornment"
                    margin="normal"
                    fullWidth
                    type="number"
                    inputRef={refWeight}
                    defaultValue={2}
                    InputProps={{
                        startAdornment: <InputAdornment position="start">lb</InputAdornment>,
                    }}
                />
                <FormControl>
                    <FormControlLabel control={<Checkbox onChange={e=>console.log(refPublic.current.checked)} inputRef={refPublic} />} label={`Public`} />
                </FormControl>
                <TextField
                    autoFocus
                    margin="normal"
                    label="Product Description"
                    multiline
                    inputRef={refDescription}
                    rows={10}
                    fullWidth
                    variant="outlined"
                />
                
                <Paper onClick={e=>refImage.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                    {ProductImage?(
                        <img style={{width:"80%"}} src={window.URL.createObjectURL(ProductImage)} />
                    ):(
                        <>
                        <ImageOutlined style={{fontSize:"10vw",color:"gray"}} />
                        <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload Product Main Image</Typography>
                        </>
                    )}
                </Paper>
                <input hidden accept="image/*" onChange={e=>setProductImage(e.target.files[0])} type="file" ref={refImage} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setNewProduct(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>saveProduct()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={ShowProduct?true:false}
                onClose={e=>setShowProduct(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle></DialogTitle>
                {ShowProduct&&(
                    <DialogContent>
                        <Typography align="center" variant="h4" component={`h4`} >{ShowProduct.title}</Typography>
                        <div style={{display:"flex",justifyContent:"center"}} ><img style={{width:"40%"}} src={ShowProduct.image_url?ShowProduct.image_url:`${BACKEND_URL}/shop/products/${ShowProduct._id}/image`} /></div>
                        <Divider/>
                        <Grid container alignItems={`center`} justifyContent={`center`} >
                            <Grid item xs={8}>
                                <Typography>{ShowProduct.public?"Store : Public":"Store : Private"}</Typography>
                                <Typography>{ShowProduct.category_1&&"Category 1 : "+ShowProduct.category_1.title}</Typography>
                                <Typography>{ShowProduct.category_2&&"Category 2 : "+ShowProduct.category_2.title}</Typography>
                                <Typography>{ShowProduct.category_3&&"Category 3 : "+ShowProduct.category_3.title}</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                <Typography>{ShowProduct.length&&"Length : "+ShowProduct.length+" in"}</Typography>
                                <Typography>{ShowProduct.width&&"Width : "+ShowProduct.width+" in"}</Typography>
                                <Typography>{ShowProduct.height&&"Height : "+ShowProduct.height+" in"}</Typography>
                                <Typography>{ShowProduct.weight&&"Weight : "+ShowProduct.height+" lb"}</Typography>
                            </Grid>
                        </Grid>
                        <Divider/>
                        <div style={{display:"flex"}} >
                            <Typography >{ShowProduct.price&&"Price : "+ShowProduct.price} USD $</Typography>
                            <div style={{flexGrow:1}} ></div>
                        </div>
                        <Divider/>
                        <Typography>Description : </Typography>
                        <div dangerouslySetInnerHTML={{__html:ShowProduct.description}} >

                        </div>
                    </DialogContent>
                )}
            </Dialog>
            <Dialog
                open={UploadFile}
                onClose={e=>setUploadFile(false)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Upload CSV File</DialogTitle>
                <DialogContent>
                <Paper onClick={e=>refCSV.current.click()} elevation={8}  sx={{padding:5,textAlign:"center"}} >
                    {ProductFile?(
                        <TableChartOutlined sx={{fontSize:"5vw",color:'darkgray'}} />
                    ):(
                        <>
                        {/* <ImageOutlined style={{fontSize:"10vw",color:"gray"}} /> */}
                        <Typography component={`h5`} sx={{color:"gray"}} variant="h5" >Click to Upload CSV File</Typography>
                        </>
                    )}
                </Paper>
                <input hidden onChange={e=>setProductImage(e.target.files[0])} type="file" ref={refImage} />
                <input hidden accept=".csv" onChange={e=>setProductFile(e.target.files[0])} type="file" ref={refCSV} />
                </DialogContent>
                <DialogActions>
                <Button variant="outlined" onClick={e=>setUploadFile(false)}>Cancel</Button>
                <Button variant="contained" onClick={e=>uploadCSV()}>Save</Button>
                </DialogActions>
            </Dialog>
            <Dialog
                open={EditProduct?true:false}
                onClose={e=>setEditProduct(null)}
                fullWidth
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle>Edit Product Detail</DialogTitle>
                <form onSubmit={editProduct} >
                <DialogContent>
                    {EditProduct&&(
                        <>
                        <TextField
                        variant="outlined"
                        label="Title"
                        defaultValue={EditProduct.title}
                        fullWidth
                        name="title"
                        />
                        {AllCategories&&(
                            <>
                            <TextField
                                margin="normal"
                                label="Product Category"
                                fullWidth
                                select
                                variant="outlined"
                                name="category_1"
                                defaultValue={EditProduct.category_1?EditProduct.category_1._id:""}
                            >
                                <MenuItem  value={""} >
                                    
                                </MenuItem>
                                {AllCategories&&AllCategories.map((oneCategory,index)=>{
                                    return (
                                        <MenuItem key={index} value={oneCategory._id} >
                                            {oneCategory.title}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            <TextField
                                margin="normal"
                                label="Product Category"
                                fullWidth
                                select
                                variant="outlined"
                                name="category_2"
                                defaultValue={EditProduct.category_2?EditProduct.category_2._id:""}
                            >
                                <MenuItem  value={""} >
                                    
                                </MenuItem>
                                {AllCategories&&AllCategories.map((oneCategory,index)=>{
                                    return (
                                        <MenuItem key={index} value={oneCategory._id} >
                                            {oneCategory.title}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            <TextField
                                margin="normal"
                                label="Product Category"
                                fullWidth
                                select
                                variant="outlined"
                                name="category_3"
                                defaultValue={EditProduct.category_3?EditProduct.category_3._id:""}
                            >
                                <MenuItem  value={""} >
                                    
                                </MenuItem>
                                {AllCategories&&AllCategories.map((oneCategory,index)=>{
                                    return (
                                        <MenuItem key={index} value={oneCategory._id} >
                                            {oneCategory.title}
                                        </MenuItem>
                                    )
                                })}
                            </TextField>
                            </>
                        )}
                        <TextField
                            label="Price"
                            id="outlined-start-adornment"
                            margin="normal"
                            fullWidth
                            type="number"
                            name="price"
                            defaultValue={EditProduct.price&&EditProduct.price}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">USD $</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Length"
                            id="outlined-start-adornment"
                            margin="normal"
                            fullWidth
                            type="number"
                            name="length_"
                            defaultValue={EditProduct.length&&EditProduct.length}
                            InputProps={{
                                startAdornment: <InputAdornment position="start">in</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Width"
                            id="outlined-start-adornment"
                            margin="normal"
                            fullWidth
                            type="number"
                            defaultValue={EditProduct.width&&EditProduct.width}
                            name="width"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">in</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Height"
                            id="outlined-start-adornment"
                            margin="normal"
                            fullWidth
                            type="number"
                            defaultValue={EditProduct.height&&EditProduct.height}
                            name="height"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">in</InputAdornment>,
                            }}
                        />
                        <TextField
                            label="Weight"
                            id="outlined-start-adornment"
                            margin="normal"
                            fullWidth
                            type="number"
                            defaultValue={EditProduct.weight&&EditProduct.weight}
                            name="weight"
                            InputProps={{
                                startAdornment: <InputAdornment position="start">lb</InputAdornment>,
                            }}
                        />
                        <FormControl>
                            <FormControlLabel control={<Checkbox name="public" checked={EditProduct.public?true:false} inputRef={refPublic} />} label={`Public`} />
                        </FormControl>
                        <TextField
                            autoFocus
                            margin="normal"
                            label="Product Description"
                            multiline
                            defaultValue={EditProduct.description&&EditProduct.description}
                            rows={10}
                            fullWidth
                            variant="outlined"
                            name="description"
                        />
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button variant="outlined" type="button" onClick={e=>setEditProduct(null)}>Cancel</Button>
                    <Button variant="contained" type="submit" >Save</Button>
                </DialogActions>
                </form>
            </Dialog>
            <Confirm open={DeleteProduct?true:false} onOk={()=>{deleteProduct(DeleteProduct)}} onCancel={e=>setDeleteProduct(null)} />
            <Confirm open={DeleteAll} />
        </>
    )
}
export default AdminProductsPage