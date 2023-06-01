import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000' });


export const fetchWorkoutsBySearch = (searchQuery) => API.get(`/dashboard/search?searchQuery=${searchQuery.search || 'none'}&tags=${searchQuery.tags}`);
