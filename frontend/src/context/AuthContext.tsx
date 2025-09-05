'use client'

import React, {createContext, useContext, 
    useState, useEffect, ReactNode,
    useCallback} from 'react';
import { logoutUser } from '@/lib/auth';

interface User {
    username: string;
}

interface loginResponse {
    access_token: string;
    refresh_token: string;
    token_type: string;
}

export interface LoginFormFields { 
    username: string;
    password: string;
}

export interface RegisterFormFields { 
    username: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    isLoggedIn: boolean;
    login: (data: loginResponse) => void;
    logout: () => Promise<void>;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {

    const [user, setUser] = useState<User | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(true);


    const checkLogInState = useCallback(() => {
        try {
            const accessToken = localStorage.getItem('access_token');
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const refreshToken = localStorage.getItem('refresh_token');

            if (accessToken) {
                setUser({username: 'User'})
                setIsLoggedIn(true);
            } else {
                setUser(null);
                setIsLoggedIn(false);
            }

        } catch (error) {
            console.error("Error: ", error);
            console.error("Error checking login state:", error);
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setIsLoggedIn(false);
        } finally {
            setLoading(false);
            }
    }, []);
        
    useEffect(() => {
            checkLogInState();
        }, [checkLogInState]);

    const login = (data: unknown) => {
        const responseData = data as loginResponse
        localStorage.setItem('access_token', responseData.access_token);
        localStorage.setItem('refresh_token', responseData.refresh_token);
        window.location.href = '/';
    };

    const logout = useCallback(async () => { 
        setLoading(true);
        try {
            await logoutUser(); 
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            setUser(null);
            setIsLoggedIn(false);
            window.location.href = '/login';
            
        } catch (error) {
            console.error("Failed to logout:", error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

  const value = {
        user,
        isLoggedIn,
        login,
        logout,
        loading,
    };

  return (<AuthContext.Provider value={value}>{!loading ? children : null}</AuthContext.Provider>);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};