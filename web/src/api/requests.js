import client from './client';

export const getRequests = () => client.get('/admin/requests');

export const updateRequestStatus = (id, status) => client.post(`/admin/requests/${id}/status`, { status });

