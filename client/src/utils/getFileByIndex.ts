export const getFileByIndex = async (index: number, token: string): Promise<Blob | string> => {
    try {
        const response = await fetch(`http://vps.thut.tech/blob/${index}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/json',
            },
        });

        if (response.ok) {
            const blob = await response.blob();
            return blob;
        } else {
            return 'Failed to retrieve file';
        }
    } catch (error) {
        return 'An error occurred while retrieving the file';
    }
};
