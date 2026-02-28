import axios from 'axios';

const API_URL = 'http://localhost:5000/api/reviews';

export const submitReview = async (reviewData) => {
  try {
    // This sends the data to Parijat's server
    const response = await axios.post(`${API_URL}/process`, reviewData);
    return response.data; // This will contain the AI results
  } catch (error) {
    console.error("Error connecting to backend:", error);
    throw error;
  }
};