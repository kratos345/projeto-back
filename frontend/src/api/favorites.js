import client from './client';

export const addFavorite = (propertyId) => client.post('/favorites', { propertyId });

export const removeFavorite = (propertyId) => client.delete(`/favorites/${propertyId}`);

export const getMyFavorites = () => client.get('/favorites');
