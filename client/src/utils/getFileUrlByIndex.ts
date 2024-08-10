/* export const getFileURLByIndex = async (index: number, token: string): Promise<string | null> => {
    try {
        const response = await fetch(`http://vps.thut.tech/file/${index}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            console.log(response);
            const data = await response.json();
            return data.url; // Assuming the server returns { url: '...' }
        } else {
            const errorMessage = await response.text();
            console.error(`Failed to retrieve file URL: ${errorMessage}`);
            return null;
        }
    } catch (error) {
        console.log(error);
        console.error(`An error occurred while retrieving the file URL`);
        return null;
    }
}; */

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

