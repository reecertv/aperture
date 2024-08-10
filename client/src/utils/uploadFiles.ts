export const uploadFiles = async (files: File[], token: string): Promise<string> => {
    const formData = new FormData();
    files.forEach(async (file) => {
        formData.append('files', file);
    });

    try {
        const response = await fetch('https://vps.thut.tech/upload', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${token}`
            },
            body: formData,
        });

        if (response.ok) {
            return 'Files uploaded successfully';
        } else {
            return 'Failed to upload files';
        }
    } catch (error) {
        return 'An error occurred during upload';
    }
};