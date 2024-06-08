/* eslint-disable */
import axios from 'axios'

const baseURL = process.env.REACT_APP_BASE_URL

export const deleteInstance = axios.create({
  baseURL: baseURL,
  method: 'DELETE',
})

export const getInstance = axios.create({
  baseURL: baseURL,
  method: 'GET',
})

export const updateInstance = axios.create({
  baseURL: baseURL,
  method: 'PUT',
})

export const addInstance = axios.create({
  baseURL: baseURL,
  method: 'POST',
})

const authToken = localStorage.getItem('authToken')

if (authToken) {
  getInstance.defaults.headers.common['Authorization'] = `${authToken}`
  deleteInstance.defaults.headers.common['Authorization'] = `${authToken}`
  updateInstance.defaults.headers.common['Authorization'] = `${authToken}`
  addInstance.defaults.headers.common['Authorization'] = `${authToken}`
}
