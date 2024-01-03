import axios from 'axios'
const API_URL = import.meta.env.VITE_API_ENDPOINT;
export default axios.create({
  baseURL: API_URL
});
