'use client';

import React, { createContext, useState, useContext, ReactNode } from "react";

interface LayoutContextType {
    isSidebarExtended: boolean;
    toggleSidebar: () => void;
    headerTitle: string;
    setHeaderTitle: (title: string) => void;
}

const LayoutContext = createContext<LayoutContextType | undefined>(undefined);

export const LayoutProvider = ({ children }: { children: ReactNode }) => {
  const [isSidebarExtended, setIsSidebarExtended] = useState(true); 
  const [headerTitle, setHeaderTitle] = useState('Welcome!'); 

  const toggleSidebar = () => {
    setIsSidebarExtended((prev) => !prev);
  };

  const value = {
    isSidebarExtended,
    toggleSidebar,
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