import axios from 'axios';
import { BASE_API_URL } from "../constants/auth_constants";

const instance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
        'Content-Type': 'application/json'
    },
});

export default instance;