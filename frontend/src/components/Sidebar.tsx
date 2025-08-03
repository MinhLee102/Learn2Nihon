'use client';

import React from 'react';
import Link from 'next/link';
import { useLayout } from '@/context/LayoutContext';
import Picture from './Picture';

interface SidebarItemProps {
  iconInfo: { url: string; width: number; height: number; alt: string };
  text: string;
  href: string;
  isExtended: boolean;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  iconInfo,
  text,
  href,
  isExtended,
}) => {
  return (
    <Link
      href={href}
      className={`
        flex items-center p-2 my-1 rounded-md
        transition-colors duration-200
        hover:bg-sidebarBg/70 text-white
        ${isExtended ? 'justify-start' : 'justify-center'}
      `}
    >
      <Picture url={iconInfo.url} width={iconInfo.width} height={iconInfo.height} alt={iconInfo.alt}
      className={`
            ${isExtended ? 'mr-3' : ''} // <--- ĐÂY LÀ CHỖ CẦN ĐIỀU CHỈNH
        `}/>
      {isExtended && <span className="whitespace-nowrap">{text}</span>}
    </Link>
  );
};

const Sidebar: React.FC = () => {
  const { isSidebarExtended, toggleSidebar } = useLayout();

  const navItems = [
    {
      iconInfo: { url: '/translation-app.png', width: 24, height: 24, alt: 'Tra cứu' },
      text: 'Tra cứu',
      href: '/',
    },
    {
      iconInfo: { url: '/book-bookmark.png', width: 24, height: 24, alt: 'Từ vựng' },
      text: 'Từ vựng',
      href: '/vocabulary',
    },
    {
      iconInfo: { url: '/reading.png', width: 24, height: 24, alt: 'Bài đọc' },
      text: 'Bài đọc',
      href: '/reading',
    },
    {
      iconInfo: { url: '/listening.png', width: 24, height: 24, alt: 'Bài nghe' },
      text: 'Bài nghe',
      href: '/listening',
    },
    {
      iconInfo: { url: '/test.png', width: 24, height: 24, alt: 'Thi thử' },
      text: 'Thi thử',
      href: '/test',
    },
  ];

  return (
    <aside
      className={`
        fixed left-0 top-0 bottom-0
        bg-[#7289DA] text-white
        p-4
        flex flex-col z-40 
        shadow-lg
        transition-all duration-300 ease-in-out
        ${isSidebarExtended ? 'w-64' : 'w-20'}
      `}
      style={{ minHeight: '100vh' }} 
    >

    <div
        className={`
          flex items-center mb-8
          ${isSidebarExtended ? 'justify-start' : 'justify-center'} 
        `}
      >
        <button
          onClick={toggleSidebar}
          className={`
            text-white hover:bg-sidebarBg/70 p-2 rounded-md
            focus:outline-none focus:ring-2 focus:ring-white
            ${isSidebarExtended ? '' : 'mx-auto'} 
          `}
          aria-label="Toggle Sidebar"
        >
          <Picture
            url="/menu.png" 
            width={24}
            height={24}
            alt="Menu Toggle"
          />
        </button>
      </div>

      <nav className="flex-1">
        {navItems.map((item) => (
          <SidebarItem
            key={item.text}
            iconInfo={item.iconInfo}
            text={item.text}
            href={item.href}
            isExtended={isSidebarExtended}
          />
        ))}
      </nav>

    </aside>
  );
};

export default Sidebar;