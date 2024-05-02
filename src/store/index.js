import { configureStore } from '@reduxjs/toolkit'
import testReducer from './reducers/test.reducer'
import authReducer from './reducers/auth.reducer'

export default configureStore({
  reducer: {
    testReducer,
    authReducer
  }
})