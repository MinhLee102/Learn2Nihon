import { Email, loginResponse, User } from "@/types/authType";
import apiClient from "./apiConfig";


export const loginUser = async (data: Record<string, string>): Promise<loginResponse | undefined> => {

    const formData = new URLSearchParams();

    if (data.username) formData.append('username', data.username);
    if (data.password) formData.append('password', data.password);
    
    const response = await apiClient.post('/login', formData, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });
    return response.data;
};

export const sendVerificationEmail = async (data: Email): Promise<{ msg: string } | undefined> => {
    try {
        const response = await apiClient.post<{ msg: string }>('/account_verification/send-verification/', data); 
        return response.data;
    } catch (error: unknown) {
        console.error("Failed to send verification email:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Gửi email xác minh thất bại.");
        }
        throw new Error("Gửi email xác minh thất bại.");
    }
};

export const registerUser = async (data: Record<string, string>): Promise<User | undefined> => {
    let registeredUser: User | undefined;
    try {
        const registerResponse = await apiClient.post<User>('/users', data); 
        registeredUser = registerResponse.data;

        if (registeredUser?.id && registeredUser?.email) { 
            console.log("User registered successfully, attempting to send verification email...");
            const emailResponse = await sendVerificationEmail({ email: registeredUser.email });

            if (emailResponse?.msg) {
                console.log("Verification email sent successfully for user:", registeredUser.email);
                return registeredUser; 
            } else {
                console.warn("User registered but failed to send verification email:", registeredUser.email);
                throw new Error("Đăng ký thành công nhưng không thể gửi email xác minh.");
            }
        } else {
             throw new Error("Đăng ký thất bại: Không nhận được thông tin người dùng hoặc email từ server.");
        }
    } catch (error: unknown) {
        console.error("Registration process failed:", error);
        if (error instanceof Error) {
            throw error;
        }
        throw new Error("Đăng ký thất bại. Vui lòng thử lại.");
    }
};
export const logoutUser = async (): Promise<{ message: string } | undefined> => {
    try {
        const response = await apiClient.post<{ message: string }>('/logout/'); 
        return response.data;
    } catch (error: unknown) {
        console.error("Logout failed:", error);
        if (error instanceof Error) {
            throw new Error(error.message || "Đăng xuất thất bại.");
        }
        throw new Error("Đăng xuất thất bại.");
    }
};