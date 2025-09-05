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

export const logoutUser = async (): Promise<{ message: string } | undefined> => {
    try {
        const response = await apiClient.post<{ message: string }>('/logout'); 
        return response.data;
    } catch (error: unknown) {
        console.error("Logout failed:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Đăng xuất thất bại.");
        }
        throw new Error("Đăng xuất thất bại.");
    }
};