/* eslint-disable */
import { createSlice } from '@reduxjs/toolkit'

const initialValue = {
  AppointmentScreen: [],
  settingsScreen: [],
  mainScreens: [],
  


}

export const roleSlice = createSlice({
  name: 'roleScreen',
  initialState: { roleScreen: initialValue },
  reducers: {
    setNavigation: (state, action) => {
      state.roleScreen = action.payload
    },
    cleanupRoleScreen: (state, action) => {
      state.roleScreen = initialValue
    },
  },
})

export const { setNavigation, cleanupRoleScreen } = roleSlice.actions
export default roleSlice.reducer
