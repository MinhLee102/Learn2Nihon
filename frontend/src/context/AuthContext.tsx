'use client'

import React, {createContext, useContext, 
    useState, useEffect, ReactNode,
    useCallback} from 'react';
//import { logoutUser } from '@/utils/api/auth';

interface User {
    id: number;
    username: string;
    email: string;
}

interface loginResponce {
    access: string;
    refresh: string;
    user: User;
}

interface AuthContextType {
    user: User | null;
    login: (data: unknown) => void;
    loading: boolean;
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    const checkLogInState = useCallback(() => {
        try {
            const storedUser = localStorage.getItem('user');
            const accessToken = localStorage.getItem('access_token');

             if (storedUser && accessToken) {
                setUser(JSON.parse(storedUser));
            }
        } catch (error) {
            console.error("Error: ", error);
            //const refreshToken = localStorage.getItem('refresh_token');
            //if (refreshToken !== null)
                //logoutUser(refreshToken);
        } finally {
            setLoading(false);
            }
    }, []);
        
    useEffect(() => {
            checkLogInState();
        }, [checkLogInState]);

    const login = (data: unknown) => {
        const responseData = data as loginResponce
        localStorage.setItem('access_token', responseData.access);
        localStorage.setItem('user', JSON.stringify(responseData.user));
        
        setUser(responseData.user);

        window.location.href = '/';
    };

  const value = {user, login, loading};

  return (<AuthContext.Provider value={value}>{!loading ? children : null}</AuthContext.Provider>);
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};