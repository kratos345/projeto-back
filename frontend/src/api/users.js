import api from './client'
export const getUsers          = ()      => api.get('/users')
export const getUserById       = (id)    => api.get(`/users/${id}`)
export const getCurrentUser    = ()      => api.get('/users/me')
export const updateCurrentUser = (data)  => api.put('/users/me', data)
export const updateUser        = (id, d) => api.put(`/users/${id}`, d)
export const deleteUser        = (id)    => api.delete(`/users/${id}`)
