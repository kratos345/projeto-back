import client from './client';

export const scheduleVisit = (data) => client.post('/visits', data);

export const getVisitsByLead = (leadId) => client.get(`/visits/lead/${leadId}`);

export const updateVisitStatus = (id, data) => client.put(`/visits/${id}/status`, data);
