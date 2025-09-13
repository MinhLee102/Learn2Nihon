export interface User {
    id: string;
    username: string;
    email: string;
}

export interface Email { 
    email: string;
}

export interface loginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginFormFields { 
    username: string;
    password: string;
}

export interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (data: loginResponse) => void;
    logout: () => Promise<void>;
    loading: boolean;
}
