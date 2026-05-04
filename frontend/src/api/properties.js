import client from './client';

export const getProperties = (filters = {}) => {
  const params = new URLSearchParams(filters);
  return client.get(`/properties?${params}`);
};

export const getPropertyById = (id) => client.get(`/properties/${id}`);

export const createProperty = (data) => client.post('/properties', data);

export const getMyProperties = () => client.get('/properties/vendedor/minhas');

export const updateProperty = (id, data) => client.put(`/properties/${id}`, data);

export const deleteProperty = (id) => client.delete(`/properties/${id}`);

export const approveProperty = (id) => client.post(`/properties/${id}/approve`);

export const rejectProperty = (id) => client.post(`/properties/${id}/reject`);
