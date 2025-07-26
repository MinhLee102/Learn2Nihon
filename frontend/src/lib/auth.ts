import apiClient from "./apiConfig";


export const loginUser = (data: Record<string, string>) => {

    const formData = new URLSearchParams();

    if (data.username) formData.append('username', data.username);
    if (data.password) formData.append('password', data.password);
    
    return apiClient.post('/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
};

export const registerUser = (data: Record<string, string>) => {
    return apiClient.post('/users', data)
};

