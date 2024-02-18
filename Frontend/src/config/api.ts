import axios from 'axios';
import { apiBaseUrl } from '.';

export const Axios = axios.create({
    withCredentials: true,
    baseURL: apiBaseUrl,
});
