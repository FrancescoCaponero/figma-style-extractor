import axios from 'axios';

const figmaAxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_FIGMA_API_BASE_URL,
});

export default figmaAxiosInstance;
