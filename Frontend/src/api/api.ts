import axios from 'axios';

export const fetchData = async (url: string) => {
    const { data } = await axios(`${import.meta.env.VITE_API_BASE_URL}${url}`, { method: 'GET' });
    return data;
};

export const postData = async (url: string) => {
    const { data } = await axios(`${import.meta.env.VITE_API_BASE_URL}${url}`, { method: 'POST' });
    return data;
};
