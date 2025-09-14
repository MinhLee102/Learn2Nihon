'use client'; 

import { ReactNode } from 'react';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { useLayout } from '@/context/LayoutContext';

export default function MainAppLayout({ children }: { children: ReactNode }) {
  const { isSidebarExtended } = useLayout();

  return (
    <>
      <Sidebar />
      <div className="flex flex-col flex-1 relative">
        <Header />
        <main
          className={`
            flex-1 p-4 pt-20 
            transition-all duration-300 ease-in-out
            ${isSidebarExtended ? 'md:ml-64' : 'md:ml-20'} 
            overflow-y-auto 
            h-full flex flex-col
          `}
          style={{ minHeight: 'calc(100vh - 4rem)' }} 
        >
          {children} 
        </main>
      </div>
    </>
  );
}