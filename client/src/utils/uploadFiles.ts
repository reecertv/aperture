export const uploadFiles = async (files: File[], username: string, password: string): Promise<string> => {
    const formData = new FormData();
    files.forEach((file) => {
        formData.append('files', file);
    });

    try {

        return ''
    } catch (error) {
        return 'An error occurred during upload';
    }
};
