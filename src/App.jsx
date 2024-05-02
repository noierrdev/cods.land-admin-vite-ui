import React from 'react'
import AppContext from "./AppContext";
import {BrowserRouter} from 'react-router-dom'
import AppRoutes from './routes'

import {createTheme,ThemeProvider} from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import {SnackbarProvider} from 'notistack'

import {Provider} from 'react-redux'
import store from './store'

function App() {
  const theme=createTheme({
    palette:{
      mode:'light',
      primary:{
        main: '#2E3192',
        light: '#2E3192',
        dark: '#2E3192',
        contrastText: '#fff',
      }
    },
  })
  return (
    <AppContext.Provider value={{}} >
      <Provider store={store} >
        <ThemeProvider theme={theme} >
          <CssBaseline/>
          <SnackbarProvider maxSnack={3} anchorOrigin={{vertical:'top',horizontal:"left"}} >
            
            <BrowserRouter>
              <AppRoutes/>
            </BrowserRouter>
            
          </SnackbarProvider>
        </ThemeProvider>
      </Provider>
    </AppContext.Provider>
  );
}

export default App;
