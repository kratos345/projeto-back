import client from './client';

export const addFavorite = (propertyId) => client.post('/favorites', { property_id: propertyId });

export const removeFavorite = (propertyId) => client.delete(`/favorites/${propertyId}`);

export const getMyFavorites = () => client.get('/favorites');
