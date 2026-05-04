import client from './client';

export const createLead = (data) => client.post('/leads', data);

export const getMyLeads = () => client.get('/leads/vendedor/meus');

export const getMyLeadsMetrics = () => client.get('/leads/vendedor/metrics');

export const getLeadsByProperty = (propertyId) => client.get(`/leads/property/${propertyId}`);

export const updateLeadStatus = (id, data) => client.put(`/leads/${id}/status`, data);
