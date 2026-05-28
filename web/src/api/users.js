import api from './client'
export const getUsers          = ()      => api.get('/users')
export const getUserById       = (id)    => api.get(`/users/${id}`)
export const getCurrentUser    = ()      => api.get('/users/me')
export const updateCurrentUser = (data)  => api.put('/users/me', data)
export const getUserSettings   = ()      => api.get('/users/me/settings')
export const updateUserSettings= (data)  => api.put('/users/me/settings', data)
export const uploadAvatar      = (file)  => {
  const formData = new FormData();
  formData.append('avatar', file);
  return api.post('/users/me/avatar', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
}
export const getSellers        = ()      => api.get('/users/sellers')
export const getSellerSales    = (id)    => api.get(`/users/sellers/${id}/sales`)
export const updateUser        = (id, d) => api.put(`/users/${id}`, d)
export const deleteUser        = (id)    => api.delete(`/users/${id}`)
