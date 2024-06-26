import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
// import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useSnackbar } from 'notistack';
import axios from 'axios'
import { BACKEND_URL } from '../../AppConfigs';
import { useDispatch } from 'react-redux';
import {authSuccess} from '../../store/reducers/auth.reducer'
import { useNavigate } from 'react-router-dom';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      <Link color="inherit" href="https://cods.land">
        cods.land
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const snackbar=useSnackbar();
  const dispatch=useDispatch();
  const navigate=useNavigate()
  const handleSubmit = (event) => {
      event.preventDefault();
      const data = new FormData(event.currentTarget);
      
      if(!data.get('email')) return snackbar.enqueueSnackbar("Input Email!",{variant:"error"});
      if(!data.get('password')) return snackbar.enqueueSnackbar("Input Password",{variant:"error"})
      axios.post(`${BACKEND_URL}/admin/signin`,{
        email:data.get('email'),
        password:data.get('password')
      })
      .then(response=>{
        if(response.data.status==="success"){
          snackbar.enqueueSnackbar("Login Successfully",{variant:"success",autoHideDuration:1000})
          dispatch(authSuccess(response.data.data))
          sessionStorage.setItem('token',response.data.data.token)
          navigate('/')
        }else{
          snackbar.enqueueSnackbar(response.data.error,{variant:"error"})
        }
      })
  };

  return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        {/* <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        > */}
          <div
          style={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {/* <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}> */}
          <form component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign In
            </Button>
            <Grid container>
              <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                {/* <Link href="#" variant="body2">
                  {"Don't have an account? Sign Up"}
                </Link> */}
              </Grid>
            </Grid>
          {/* </Box> */}
        {/* </Box> */}
        </form>
        </div>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
  );
}