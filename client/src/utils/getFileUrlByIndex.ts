import axios from 'axios';

const BASE_URL = 'https://vps.thut.tech';

export const getFileUrlByIndex = async (index: number, token: string) => {
    try {
        const response = await axios.get(`${BASE_URL}/img/${index}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        console.log(response.data);
        return response.data.url;
    } catch (error) {
        console.error('Error fetching image URL:', error);
        return '';
    }
};

export const getImageCount = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/imgc`);
        return response.data.count;
    } catch (error) {
        console.error('Error fetching image count:', error);
        return 0;
    }
};

