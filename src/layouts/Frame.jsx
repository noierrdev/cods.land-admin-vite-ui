import * as React from 'react';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
// import AppBar from '@mui/material/AppBar';
import { styled, useTheme } from '@mui/material/styles';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { Outlet } from 'react-router-dom';
import Logo from '../assets/images/logo.png'
import {useNavigate,useLocation} from 'react-router-dom'
import { Avatar, Fab, IconButton } from '@mui/material';
import { BACKEND_URL } from '../AppConfigs';
import { useDispatch, useSelector } from 'react-redux';
import {signout} from '../store/reducers/auth.reducer'
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
const drawerWidth = 240;


const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
      flexGrow: 1,
      padding: theme.spacing(3),
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      marginLeft: `-${drawerWidth}px`,
      ...(open && {
        transition: theme.transitions.create('margin', {
          easing: theme.transitions.easing.easeOut,
          duration: theme.transitions.duration.enteringScreen,
        }),
        marginLeft: 0,
      }),
    }),
  );
  
  const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
  })(({ theme, open }) => ({
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: `${drawerWidth}px`,
      transition: theme.transitions.create(['margin', 'width'], {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
    }),
  }));
  
  const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-end',
  }));

export default function FrameLayout(props) {
    const theme = useTheme();
    const [open, setOpen] = React.useState(false);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };
    const dispatch=useDispatch();
    const navigate=useNavigate()
    const {pathname}=useLocation();
    const authData=useSelector(reducer=>reducer.authReducer.authData);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const sign_out=()=>{
        dispatch(signout());
        handleClose()
        navigate('/')
    }
    const handleChange = (event) => {
    };

    const handleMenu = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    return (
        <>
        <AppBar
        color='default'
            position="fixed"
            // sx={{ width: `calc(100% - ${drawerWidth}px)`, ml: `${drawerWidth}px` }}
        >
            <Toolbar  sx={{backgroundColor:"white"}} >
                <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    onClick={handleDrawerOpen}
                    edge="start"
                    sx={{ mr: 2, ...(open && { display: 'none' }) }}
                >
                    <MenuIcon />
                </IconButton>
                <div style={{flexGrow:1}} ></div>
                {authData&&<>
                <Avatar onMouseOver={handleMenu} sx={{margin:1}} src={`${BACKEND_URL}/auth/avatars/${authData.email}`} ></Avatar>
                <div>
                    <Typography sx={{marginTop:2,color:"gray"}} >{authData.fullname}</Typography>
                    <p style={{marginTop:"1px",color:"darkgray"}} >{authData.email}</p>
                </div>
                </>}
            </Toolbar>
            <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                // onMouseOut={handleClose}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleClose}
            >
                <MenuItem onClick={sign_out}>Sign Out</MenuItem>
            </Menu>
        </AppBar>
        <Drawer
            
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                  width: drawerWidth,
                  boxSizing: 'border-box',
                  backgroundColor:"#2E3192",
                  color:"white"
                },
                
              }}
            variant="persistent"
            anchor="left"
            open={open}
            >
            <DrawerHeader>
            <IconButton onClick={handleDrawerClose}>
                {theme.direction === 'ltr' ? <ChevronLeftIcon sx={{color:"white"}} /> : <ChevronRightIcon sx={{color:"white"}} />}
            </IconButton>
            </DrawerHeader>
            <img src={Logo} style={{width:"40%",marginLeft:"auto",marginRight:"auto"}} />
            <List  >
                {/* <ListItem disablePadding>
                    {pathname.indexOf('/dashboard')==0?(
                        <Fab style={{width:"100%"}} variant='extended' >Dashboard</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/dashboard')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Dashboard`} />
                        </ListItemButton>
                    )}
                </ListItem> */}
                {/* <ListItem disablePadding>
                    {pathname.indexOf('/users')==0?(
                        <Fab style={{width:"100%"}} variant='extended' >Users</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/users')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Users`} />
                        </ListItemButton>
                    )}
                </ListItem> */}
                <ListItem disablePadding >
                    {pathname==('/admin/products/categories')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Categories</Fab>
                    ):(
                        <ListItemButton  onClick={e=>navigate('/admin/products/categories')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Categories`} />
                        </ListItemButton>
                        // <Fab color='primary' style={{width:"100%"}} variant='extended' >Categories</Fab>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/products')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Products</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/products')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Products`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/orders')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Orders</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/orders')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Orders`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/users')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Users</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/users')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Users`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/posts')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Posts</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/posts')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Posts`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/members')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Members</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/members')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Members`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/events')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Events</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/events')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Events`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/subscribers')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Subscribers</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/subscribers')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Subscribers`} />
                        </ListItemButton>
                    )}
                </ListItem>
                <ListItem disablePadding>
                    {pathname==('/admin/appointments')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Appointments</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/appointments')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Appointments`} />
                        </ListItemButton>
                    )}
                </ListItem>
                {/* <ListItem disablePadding>
                    {pathname==('/admin/newsletters')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Newsletters</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/newsletters')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Newsletters`} />
                        </ListItemButton>
                    )}
                </ListItem> */}
                {/* <ListItem disablePadding>
                    {pathname==('/admin/posts/categories')?(
                        <Fab style={{width:"90%",marginLeft:"auto",marginRight:"auto"}} variant='extended' >Post Categories</Fab>
                    ):(
                        <ListItemButton onClick={e=>navigate('/admin/posts/categories')} >
                            <ListItemText style={{textAlign:"center"}} primary={`Post Categories`} />
                        </ListItemButton>
                    )}
                </ListItem> */}
            </List>
        </Drawer>
        <Box
            component="main"
            sx={{ flexGrow: 1, bgcolor: 'background.default', p: 3 }}
        >
            <Toolbar />
            <Outlet {...props} />
        </Box>
        </>
    );
}