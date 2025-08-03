'use client'

import Picture from "./Picture";
import React, { useState, useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import { useRouter } from 'next/navigation';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {
  
}

const Header: React.FC<HeaderProps> = () => {
    const router = useRouter();
    
    const {
        isSidebarExtended,
        toggleSidebar,
        isLoggedIn,
        username,
        logout,
        headerTitle,
    } = useLayout();

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
        if (window.scrollY > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
        };

        window.addEventListener('scroll', handleScroll);
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
    <header
      className={`
        fixed top-0 right-0 z-50
        flex items-center justify-between p-4 h-16 
        bg-primaryBg/80 
        backdrop-blur-sm 
        transition-all duration-300 ease-in-out
        ${scrolled ? 'shadow-md' : ''} 
      `}
      style={{
        left: isSidebarExtended ? 'w-64' : 'w-20', // 16rem = w-64, 5rem = w-20
      }}
    >
      <div className="flex items-center">
        <button
          onClick={toggleSidebar}
          className="mr-4 text-gray-700 hover:text-gray-900 focus:outline-none"
        >
          <Picture url={"public/menu.png"} width={24} height={24} alt="ToggleSidebar" />
        </button>
        <h1 className="text-xl font-semibold text-gray-800">
          {headerTitle}
        </h1>{' '}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-700 font-medium">Hello, {username}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 border border-primaryBlue text-primaryBlue rounded-md hover:bg-primaryBlue hover:text-white transition-colors"
            >
              Đăng nhập
            </button>
            <button 
                onClick={() => router.push('/signup')}
                className="px-4 py-2 bg-primaryBlue text-white rounded-md hover:bg-primaryBlue/90 transition-colors">
              Đăng ký
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;