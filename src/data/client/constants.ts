export const LOCAL_BASE_URL = 'http://localhost:8000';

const BASE_API_ENDPOINT = import.meta.env.VITE_PROD_BASE_URL;

export const API_ENDPOINT = BASE_API_ENDPOINT || LOCAL_BASE_URL;
console.log(API_ENDPOINT)
