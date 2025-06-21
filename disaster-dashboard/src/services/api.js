import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api'; // adjust if needed

export const fetchDisasters = async () => {
  const response = await axios.get(`${API_BASE_URL}/disasters`);
  return response.data.data;
};
