
import axios from 'axios';
export const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true,
});
console.log(`${import.meta.env.VITE_API_URL}/api`);
console.log("Axios Base URL:", axiosInstance.defaults.baseURL);

