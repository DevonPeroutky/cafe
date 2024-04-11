// LOCAL
export const LOCAL_BASE_URL = 'http://34.146.99.81:8000';

export const PROD_NGROK_URL = 'https://8ba7-34-146-237-185.ngrok-free.app';

const BASE_API_ENDPOINT = import.meta.env.VITE_PROD_BASE_URL;
console.log(BASE_API_ENDPOINT)

export const API_ENDPOINT = BASE_API_ENDPOINT || LOCAL_BASE_URL;
console.log(API_ENDPOINT)
