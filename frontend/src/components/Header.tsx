'use client'

import React, { useState, useEffect } from 'react';
import { useLayout } from '@/context/LayoutContext';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
interface HeaderProps {
  
}

const Header: React.FC<HeaderProps> = () => {
    const router = useRouter();
    
    const {
        isSidebarExtended,
        headerTitle,
    } = useLayout();

    const {
      isLoggedIn,
        user,
        logout,
    } = useAuth();

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
        bg-[#efefef]/80 
        backdrop-blur-sm 
        transition-all duration-300 ease-in-out
        ${scrolled ? 'shadow-md' : ''} 
      `}
      style={{
        left: isSidebarExtended ? '16rem' : '5rem', 
      }}
    >
      <div className="flex items-center">
        <h1 className="text-xl font-semibold text-gray-800">
          {headerTitle}
        </h1>{' '}
      </div>

      <div className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <span className="text-gray-700 font-medium">Hello, {user?.username || 'User'}!</span>
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-400 text-gray-700 rounded-md hover:bg-red-600 transition-colors"
            >
              Đăng xuất
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => router.push('/login')}
              className="px-4 py-2 bg-[#7289DA] text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Đăng nhập
            </button>
            <button 
                onClick={() => router.push('/signup')}
                className="px-4 py-2 border border-[#7289DA] text-[#7289DA] rounded-md hover:bg-blue-600 hover:text-white transition-colors">
              Đăng ký
            </button>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;