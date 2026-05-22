import client from './client';

const buildQuery = (filters = {}) => {
  const params = new URLSearchParams(filters);
  const query = params.toString();
  return query ? `?${query}` : '';
};

export const getProperties = (filters = {}) => {
  return client.get(`/properties${buildQuery(filters)}`);
};

export const getAllProperties = (filters = {}) => {
  return client.get(`/properties${buildQuery(filters)}`);
};

export const getPropertyById = (id) => client.get(`/properties/${id}`);

export const createProperty = (data) => client.post('/properties', data);

export const getMyProperties = () => client.get('/properties/vendedor/minhas');

export const updateProperty = (id, data) => client.put(`/properties/${id}`, data);

export const uploadPropertyImages = (propertyId, files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return client.post(`/properties/${propertyId}/images`, formData);
};

export const deletePropertyImage = (propertyId, imageId) => client.delete(`/properties/${propertyId}/images/${imageId}`);

export const deleteProperty = (id) => client.delete(`/properties/${id}`);

export const approveProperty = (id) => client.post(`/properties/${id}/approve`);

export const rejectProperty = (id) => client.post(`/properties/${id}/reject`);
