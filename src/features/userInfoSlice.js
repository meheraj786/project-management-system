import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  value: localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null,
}

export const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.value=action.payload
      localStorage.setItem("userInfo", JSON.stringify(action.payload))
    },
  },
})

export const { setUser } = userInfoSlice.actions

export default userInfoSlice.reducer