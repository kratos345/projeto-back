import client from './client';

export const getAdminMetrics = () => client.get('/dashboard/admin/metrics');

export const getSellerMetrics = () => client.get('/dashboard/seller/metrics');
