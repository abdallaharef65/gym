/* eslint-disable */
import { configureStore } from '@reduxjs/toolkit'

import roleSlice from './redux/Reducer/roleReducer/roleSlice'

const store2 = configureStore({
  reducer: {
    rolesSlice: roleSlice,
  },
})
export default store2
