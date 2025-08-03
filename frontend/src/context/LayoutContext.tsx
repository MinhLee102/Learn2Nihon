'use client';

import React, { createContext, useState, useContext, ReactNode } from "react";

interface LayoutContextType {
    isSidebarExtended: boolean;
    toggleSidebar: () => void;
    isLoggedIn: boolean;
    username: string;
    login: (name: string) => void;
    logout: () => void;
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarExtended, setIsSidebarExtended] = useState(true); 
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState('');
  const [headerTitle, setHeaderTitle] = useState('Welcome!'); 

  const toggleSidebar = () => {
    setIsSidebarExtended((prev) => !prev);
  };

  const login = (name: string) => {
    setIsLoggedIn(true);
    setUsername(name);
  };

  const logout = () => {
    setIsLoggedIn(false);
    setUsername('');
  };

  const value = {
    isSidebarExtended,
    toggleSidebar,
    isLoggedIn,
    username,
    login,
    logout,
    headerTitle,
    setHeaderTitle,
  };

  return (
    <LayoutContext.Provider value={value}>{children}</LayoutContext.Provider>
  );
};

export const useLayout = () => {
  const context = useContext(LayoutContext);
  if (context === undefined) {
    throw new Error('useLayout must be used within a LayoutProvider');
  }
  return context;
};