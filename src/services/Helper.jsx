import axios from "axios";

const BASE_URL = axios.create({
  baseURL: "https://drive-backend-x6ww.onrender.com",
  // baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export default BASE_URL;
